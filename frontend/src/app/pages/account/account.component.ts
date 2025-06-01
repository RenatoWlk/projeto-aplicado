import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, User, BloodBankUser, Questionnaire, PartnerUser } from '../account/account.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserAccountComponent } from './user-account/user-account.component';
import { BloodBankAccountComponent } from './bloodbank-account/bloodbank-account.component';
import { PartnerAccountComponent } from './partner-account/partner-account.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserAccountComponent,
    BloodBankAccountComponent,
    PartnerAccountComponent
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user?: User | BloodBankUser | PartnerUser;
  editUser?: User | BloodBankUser | PartnerUser;

  private userId: string | null = null;
  editProfileMode = false;
  changePasswordMode = false;
  newPassword = '';
  currentPassword = '';
  lastQuestionnaire?: Questionnaire;
  showAchievements = false;
  showQuestionnaires = false;
  addCampaignMode = false;
  editCampaignMode = false;
  campaignForm: any = {
    id: '',
    title: '',
    description: '',
    active: true
  };
  editingCampaignIndex: number | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private accountService: AccountService,
    private authService: AuthService 
  ) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    console.log('User ID:', this.userId);
    this.loadUserData();
  }

  private loadUserData() {
    this.isLoading = true;
    this.error = null;

    if (!this.userId) {
      this.error = 'Usuário não autenticado.';
      this.isLoading = false;
      return;
    }

    this.accountService.getUserById(this.userId).subscribe({
      next: (userData) => {
        console.log('User data loaded:', userData);
        this.user = userData;
        console.log('User:', this.user);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados do usuário';
        this.isLoading = false;
      }
    });
  }

  onEditProfile() {
    this.editUser = { ...this.user! };
    this.editProfileMode = true;
  }

  saveProfile() {
    if (!this.editUser) return;
    this.user = { ...this.editUser };
    this.editProfileMode = false;
  }

  cancelEdit() {
    this.editProfileMode = false;
    this.editUser = { ...this.user! };
  }

  onChangePassword() {
    this.changePasswordMode = true;
  }

  savePassword() {
    if (!this.user) return;
    this.accountService.changePassword(this.user.id!, this.currentPassword, this.newPassword).subscribe(() => {
      this.changePasswordMode = false;
      this.newPassword = '';
    });
  }

  cancelPassword() {
    this.changePasswordMode = false;
    this.newPassword = '';
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user = { ...(this.user as User), photoUrl: reader.result as string };
      };
      reader.readAsDataURL(file);
    }
  }

  addCampaign() {
    this.campaignForm = { id: '', title: '', description: '', active: true };
    this.addCampaignMode = true;
    this.editCampaignMode = false;
    this.editingCampaignIndex = null;
  }

  editCampaign(campaign: any, index: number) {
    this.campaignForm = { ...campaign };
    this.editCampaignMode = true;
    this.addCampaignMode = false;
    this.editingCampaignIndex = index;
  }

  saveCampaign() {
    if (!this.user || this.user.role !== 'BLOODBANK') return;
    const bloodBank = this.user as BloodBankUser;
    if (this.addCampaignMode) {
      this.campaignForm.id = Date.now().toString();
      bloodBank.campaigns = [...(bloodBank.campaigns || []), { ...this.campaignForm }];
    } else if (this.editCampaignMode && this.editingCampaignIndex !== null) {
      bloodBank.campaigns[this.editingCampaignIndex] = { ...this.campaignForm };
    }
    this.cancelCampaignForm();
  }

  cancelCampaignForm() {
    this.addCampaignMode = false;
    this.editCampaignMode = false;
    this.campaignForm = { id: '', title: '', description: '', active: true };
    this.editingCampaignIndex = null;
  }

  removeCampaign(campaign: any) {
    if (!this.user || this.user.role !== 'BLOODBANK') return;
    const bloodBank = this.user as BloodBankUser;
    if (confirm('Remover esta campanha?')) {
      bloodBank.campaigns = bloodBank.campaigns.filter((c: any) => c.id !== campaign.id);
    }
  }

  get bloodBankUser(): BloodBankUser | undefined {
    return this.user?.role === 'BLOODBANK' ? (this.user as BloodBankUser) : undefined;
  }

  get partnerUser(): PartnerUser | undefined {
    return this.user?.role === 'PARTNER' ? (this.user as PartnerUser) : undefined;
  }
}
