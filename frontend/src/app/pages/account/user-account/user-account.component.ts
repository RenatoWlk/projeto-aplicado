import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, UserAccountService } from './user-account.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Achievement, DashboardService, UserStats } from '../../dashboard/dashboard.service';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  userStats: UserStats = {} as any;
  private userId: string = '';
  editProfileMode = false;
  changePasswordMode = false;
  showAchievements = false;
  showQuestionnaires = false;
  loadingStatsAndAchievements: boolean = false;


  genderOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
  ];

  userAchievements: Achievement[] = [];
  hasAchievements = false;
  achievementsCount = 0;

  lastQuestionnaire: any = null;

  constructor(
    private userService: UserAccountService,
    private fb: FormBuilder,
    private authService: AuthService,
    private dashboardService: DashboardService  
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    this.loadUser();
    this.initForms();
    this.getUserStats();
  }


  private loadUser(): void {
    this.isLoading = true;
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
        this.patchProfileForm();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
      }
    });
  }

  private initForms(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      address: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11,}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      gender: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  private patchProfileForm(): void {
    if (!this.user) return;

    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      address: this.user.address?.street ||'',
      phone: this.user.phone,
      cpf: this.user.cpf,
      gender: this.user.gender,
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  onEditProfile(): void {
    this.editProfileMode = true;
    this.changePasswordMode = false;
    this.showAchievements = false;
    this.showQuestionnaires = false;
  }

  onChangePassword(): void {
    this.changePasswordMode = true;
    this.editProfileMode = false;
    this.showAchievements = false;
    this.showQuestionnaires = false;
  }

  showAchievementsView(): void {
    this.showAchievements = true;
    this.editProfileMode = false;
    this.changePasswordMode = false;
    this.showQuestionnaires = false;

    // Load achievements logic here
  }

  showQuestionnairesView(): void {
    this.showQuestionnaires = true;
    this.showAchievements = false;
    this.editProfileMode = false;
    this.changePasswordMode = false;

    // Load questionnaires logic here
  }

  hideViews(): void {
    this.editProfileMode = false;
    this.changePasswordMode = false;
    this.showAchievements = false;
    this.showQuestionnaires = false;
    this.successMessage = null;
    this.error = null;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    const updatedData = {
      ...this.user,
      ...this.profileForm.getRawValue(),
      address: { street: this.profileForm.value.address }
    };

    this.userService.updateUser(updatedData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Profile updated successfully';
        this.isLoading = false;
        this.editProfileMode = false;
      },
      error: () => {
        this.error = 'Failed to update profile';
        this.isLoading = false;
      }
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully';
        this.isLoading = false;
        this.changePasswordMode = false;
        this.passwordForm.reset();
      },
      error: () => {
        this.error = 'Failed to change password';
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editProfileMode = false;
    this.error = null;
    this.successMessage = null;
    this.patchProfileForm();
  }

  cancelPassword(): void {
    this.changePasswordMode = false;
    this.error = null;
    this.successMessage = null;
    this.passwordForm.reset();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.isLoading = true;

    this.userService.uploadPhoto(file).subscribe({
      next: (photoUrl) => {
        if (this.user) {
          this.user.photoUrl = photoUrl;
        }
        this.successMessage = 'Photo updated successfully';
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to upload photo';
        this.isLoading = false;
      }
    });
  }

  // Placeholder methods to be implemented with actual logic
  calculateDaysSinceLastDonation(): number | null {
    // logic here
    return null;
  }

  calculateDaysUntilNextDonation(): number | null {
    // logic here
    return null;
  }

  canDonateNow(): boolean {
    // logic here
    return false;
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(form: FormGroup, field: string): string | null {
      const control = form.get(field);
      if (!control || !control.touched || !control.errors) return null;

      if (control.errors['required']) return 'Campo obrigatório';
      if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['pattern']) {
      if (field === 'cpf') return 'CPF deve conter exatamente 11 números';
      if (field === 'phone') return 'Celular deve conter ao menos 11 números';
    }

  return 'Campo inválido';
  }

   public getUserStats(): void {
    this.dashboardService.getUserStats(this.userId).subscribe((stats: UserStats) => {
      stats.achievements = this.sortAchievementsByRarity(stats.achievements);
      stats.timeUntilNextDonation = this.getReadableTimeUntilNextDonation(stats.timeUntilNextDonation);
      this.userStats = stats;
      this.loadingStatsAndAchievements = false;
    });
  }

   private sortAchievementsByRarity(achievements: any[]): any[] {
    const order: { [key: string]: number } = {
      comum: 1,
      raro: 2,
      épico: 3,
      lendário: 4,
      mítico: 5
    };

    return achievements.sort((a, b) => order[a.rarity.toLowerCase()] - order[b.rarity.toLowerCase()]);
  }

  /**
   * Returns a human-readable string for the time until the next donation.
   * 
   * @param secondsString - The time in seconds until the next donation.
   * @returns A string representing the time in a human-readable format.
   */
  getReadableTimeUntilNextDonation(secondsString: string): string {
    const seconds = parseInt(secondsString);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);

    return parts.length > 0 ? parts.join(' ') : 'Já pode doar';
  }

}
