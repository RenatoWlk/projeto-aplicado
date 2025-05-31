import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, Questionnaire, AccountService, UserUpdateRequest } from '../account.service';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent implements OnInit {
  @Input() user?: User;
  @Input() lastQuestionnaire?: Questionnaire;
  @Output() userChange = new EventEmitter<User>();

  // Estados do componente
  editProfileMode = false;
  changePasswordMode = false;
  showAchievements = false;
  showQuestionnaires = false;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Formulários
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.setupProfileForm();
  }

  private initializeForms() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, this.phoneValidator]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      gender: ['', [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private setupProfileForm() {
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: this.user.address || '',
        phone: this.user.phone || '',
        cpf: this.user.cpf || '',
        gender: this.user.gender || ''
      });
    }
  }

  // === CUSTOM VALIDATORS ===
  private phoneValidator(control: any) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  private cpfValidator(control: any) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(control.value) ? null : { invalidCpf: true };
  }

  private passwordMatchValidator(control: any) {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // === PERFIL METHODS ===
  onEditProfile() {
    this.setupProfileForm();
    this.editProfileMode = true;
    this.clearMessages();
  }

  async saveProfile() {
    if (!this.profileForm.valid || !this.user) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      const updateData: UserUpdateRequest = this.profileForm.value;
      
      // Para desenvolvimento, atualizar localmente
      this.user = { ...this.user, ...updateData };
      this.userChange.emit(this.user);
      this.editProfileMode = false;
      
      // Quando tiver backend integrado:
      // const updatedUser = await this.accountService.updateProfile(this.user.id, updateData).toPromise();
      // this.user = updatedUser;
      // this.userChange.emit(this.user);
      
      this.showSuccess('Perfil atualizado com sucesso!');
    } catch (error) {
      this.error = 'Erro ao salvar perfil. Tente novamente.';
      console.error('Erro ao salvar perfil:', error);
    } finally {
      this.isLoading = false;
    }
  }

  cancelEdit() {
    this.editProfileMode = false;
    this.setupProfileForm();
    this.clearMessages();
  }

  // === SENHA METHODS ===
  onChangePassword() {
    this.passwordForm.reset();
    this.changePasswordMode = true;
    this.clearMessages();
  }

  async savePassword() {
    if (!this.passwordForm.valid || !this.user) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      const newPassword = this.passwordForm.get('newPassword')?.value;
      
      // Para desenvolvimento, simular sucesso
      this.changePasswordMode = false;
      this.passwordForm.reset();
      
      // Quando tiver backend integrado:
      // await this.accountService.changePassword(this.user.id, newPassword).toPromise();
      
      this.showSuccess('Senha alterada com sucesso!');
    } catch (error) {
      this.error = 'Erro ao alterar senha. Tente novamente.';
      console.error('Erro ao alterar senha:', error);
    } finally {
      this.isLoading = false;
    }
  }

  cancelPassword() {
    this.changePasswordMode = false;
    this.passwordForm.reset();
    this.clearMessages();
  }

  // === FOTO METHODS ===
  async onPhotoSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file || !this.user) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      this.error = 'Por favor, selecione apenas arquivos de imagem.';
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'A imagem deve ter no máximo 5MB.';
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      // Para desenvolvimento, usar FileReader
      const reader = new FileReader();
      reader.onload = () => {
        if (this.user) {
          this.user = { ...this.user, photoUrl: reader.result as string };
          this.userChange.emit(this.user);
          this.showSuccess('Foto atualizada com sucesso!');
        }
      };
      reader.readAsDataURL(file);
      
      // Quando tiver backend integrado:
      // const response = await this.accountService.uploadPhoto(this.user.id, file).toPromise();
      // this.user = { ...this.user, photoUrl: response.photoUrl };
      // this.userChange.emit(this.user);
      
    } catch (error) {
      this.error = 'Erro ao fazer upload da foto. Tente novamente.';
      console.error('Erro no upload:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // === VIEWS METHODS ===
  showAchievementsView() {
    this.showAchievements = true;
    this.showQuestionnaires = false;
    this.clearMessages();
  }

  showQuestionnairesView() {
    this.showQuestionnaires = true;
    this.showAchievements = false;
    this.clearMessages();
  }

  hideViews() {
    this.showAchievements = false;
    this.showQuestionnaires = false;
    this.clearMessages();
  }

  // === HELPER METHODS ===
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  private clearMessages() {
    this.error = null;
    this.successMessage = null;
  }

  // === GETTERS ===
  get profileFormControls() {
    return this.profileForm.controls;
  }

  get passwordFormControls() {
    return this.passwordForm.controls;
  }

  get hasAchievements(): boolean {
    return !!(this.user?.achievements && this.user.achievements.length > 0);
  }

  get achievementsCount(): number {
    return this.user?.achievements?.length || 0;
  }

  get userAchievements() {
    return this.user?.achievements || [];
  }

  // === VALIDATION HELPERS ===
  getFieldError(formGroup: FormGroup, fieldName: string): string | null {
    const field = formGroup.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['invalidPhone']) {
        return 'Formato: (11) 99999-9999';
      }
      if (field.errors['invalidCpf']) {
        return 'Formato: 000.000.000-00';
      }
      if (field.errors['passwordMismatch']) {
        return 'As senhas não coincidem';
      }
    }
    
    return null;
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  // === GENDER OPTIONS ===
  genderOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
    { value: 'Prefiro não informar', label: 'Prefiro não informar' }
  ];

  // === UTILITY METHODS ===
  calculateDaysSinceLastDonation(): number | null {
    if (!this.user?.lastDonation) return null;
    
    const lastDonation = new Date(this.user.lastDonation);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  calculateDaysUntilNextDonation(): number | null {
    if (!this.user?.nextEligibleDonation) return null;
    
    const nextDonation = new Date(this.user.nextEligibleDonation);
    const today = new Date();
    const diffTime = nextDonation.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  canDonateNow(): boolean {
    const daysUntilNext = this.calculateDaysUntilNextDonation();
    return daysUntilNext === 0;
  }
}