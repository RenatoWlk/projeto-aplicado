import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, User, Questionnaire } from '../account/account.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit{
  user?: User;
  editUser?: User;
  editProfileMode = false;
  changePasswordMode = false;
  newPassword = '';
  lastQuestionnaire?: Questionnaire;
  showAchievements = false;
  
  constructor(private accountService: AccountService) {}

  ngOnInit() {
  // Simulação de usuário (mock)
  this.user = {
    id: '1',
    name: 'Pedro Silva',
    email: 'pedro@email.com',
    bloodType: 'O+',
    lastDonation: new Date(2024, 10, 15).toISOString(),
    nextEligibleDonation: new Date(2025, 1, 15).toISOString(),
    photoUrl: 'assets/profile2.png',
    achievements: [
      {
        title: 'Primeira Doação',
        description: 'Parabéns pela sua primeira doação!',
        iconUrl: 'assets/achievements.png'
      }
    ]
  };
  this.editUser = { ...this.user };

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
    this.accountService.updateProfile(this.editUser.id, this.editUser).subscribe(user => {
      this.user = user;
      this.editProfileMode = false;
    });
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
}