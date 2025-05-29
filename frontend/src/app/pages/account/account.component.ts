import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, User, BloodBankUser, Questionnaire, partner } from '../account/account.service';
import { UserAccountComponent } from './user-account/user-account.component';
import { BloodBankAccountComponent } from './bloodbank-account/bloodbank-account.component';
import { PartnerAccountComponent } from './partner-account/partner-account.component';

@Component({
  selector: 'app-account',
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
export class AccountComponent implements OnInit{
  user?: User | BloodBankUser | partner;
  editUser?: User | BloodBankUser | partner;
  editProfileMode = false;
  changePasswordMode = false;
  newPassword = '';
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
  
  constructor(private accountService: AccountService) {}

  ngOnInit() {
  //mock user
  //this.user = this.accountService.getMockUser();
  //mock partner
  this.user = this.accountService.getMockPartner();
  //mock blood bank user
  //this.user = this.accountService.getMockBloodBankUser();

   
  this.lastQuestionnaire = {
    date: new Date(2024, 10, 15).toISOString(),
    answers: [
      { question: 'Você está bem de saúde?', answer: 'Sim' },
      { question: 'Dormiu bem na última noite?', answer: 'Sim' }
    ]
  };
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
    this.accountService.changePassword(this.user.id, this.newPassword).subscribe(() => {
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
        console.log('Imagem carregada:', reader.result);
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
    return this.user?.role === 'BLOODBANK' ? this.user as BloodBankUser : undefined;
  }

  get partnerUser(): partner | undefined {
    return this.user?.role === 'partner' ? this.user as partner : undefined;
  }
}