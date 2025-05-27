import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, Questionnaire, AccountService } from '../account.service';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent {
  @Input() user?: User;
  @Input() lastQuestionnaire?: Questionnaire;
  @Output() userChange = new EventEmitter<User>();

  editUser?: User;
  editProfileMode = false;
  changePasswordMode = false;
  newPassword = '';
  showAchievements = false;
  showQuestionnaires = false;

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
        this.user = { ...(this.user as User), photoUrl: reader.result as string };
        this.userChange.emit(this.user);
      };
      reader.readAsDataURL(file);
    }
  }
}
