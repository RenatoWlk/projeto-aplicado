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
  
  constructor(private accountService: AccountService) {}

  ngOnInit() {
  const userId = '1'; // Troque pelo id real do usuário logado
  this.accountService.getUser(userId).subscribe(user => {
    user.photoUrl = 'C:/Users/Pedro/Downloads/profile.png'; // coloque o caminho de uma imagem real para testar
    // Exemplo de conquistas para teste
    user.achievements = [
      {
        title: 'Primeira Doação',
        description: 'Parabéns pela sua primeira doação!',
        iconUrl: 'assets/badges/first-donation.png'
      },
      {
        title: 'Doador Frequente',
        description: '5 doações realizadas!',
        iconUrl: 'assets/badges/frequent-donor.png'
      }
    ];
    this.user = user;
    this.editUser = { ...user };
  });
  this.accountService.getLastQuestionnaire(userId).subscribe(q => this.lastQuestionnaire = q);
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

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.user) {
      // Mostra a imagem imediatamente
      this.user.photoUrl = URL.createObjectURL(file);

      // Faz o upload normalmente
      this.accountService.uploadPhoto(this.user.id, file).subscribe(user => {
        // Atualiza a URL da foto após o upload, se o backend retornar uma nova
        this.user = user;
        console.log(this.user.photoUrl); // Veja se aparece uma URL tipo blob:http://...

      });
    }
  }
}