import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BloodBankUser, AccountService } from '../account.service';

@Component({
  selector: 'app-bloodbank-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bloodbank-account.component.html',
  styleUrls: ['./bloodbank-account.component.scss'],
})
export class BloodBankAccountComponent {
  @Input() user?: BloodBankUser;
  @Output() userChange = new EventEmitter<BloodBankUser>();

  editUser?: BloodBankUser;
  editProfileMode = false;
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

  onEditProfile() {
    this.editUser = { ...this.user! };
    this.editProfileMode = true;
  }

  saveProfile() {
    if (!this.editUser) return;
    this.user = { ...this.editUser };
    this.userChange.emit(this.user);
    this.editProfileMode = false;
  }

  cancelEdit() {
    this.editProfileMode = false;
    this.editUser = { ...this.user! };
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user = { ...(this.user as BloodBankUser), photoUrl: reader.result as string };
        this.userChange.emit(this.user);
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
    if (!this.user) return;
    const bloodBank = this.user as BloodBankUser;
    if (this.addCampaignMode) {
      this.campaignForm.id = Date.now().toString();
      bloodBank.campaigns = [...(bloodBank.campaigns || []), { ...this.campaignForm }];
    } else if (this.editCampaignMode && this.editingCampaignIndex !== null) {
      bloodBank.campaigns[this.editingCampaignIndex] = { ...this.campaignForm };
    }
    this.userChange.emit(this.user);
    this.cancelCampaignForm();
  }

  cancelCampaignForm() {
    this.addCampaignMode = false;
    this.editCampaignMode = false;
    this.campaignForm = { id: '', title: '', description: '', active: true };
    this.editingCampaignIndex = null;
  }

  removeCampaign(campaign: any) {
    if (!this.user) return;
    const bloodBank = this.user as BloodBankUser;
    if (confirm('Remover esta campanha?')) {
      bloodBank.campaigns = bloodBank.campaigns.filter((c: any) => c.id !== campaign.id);
      this.userChange.emit(this.user);
    }
  }

  get bloodBankUser(): BloodBankUser | undefined {
    return this.user?.role === 'BLOODBANK' ? this.user as BloodBankUser : undefined;
  }
}
