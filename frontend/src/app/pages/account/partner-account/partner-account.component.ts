import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { partner, Offer } from '../account.service'; // Importa o tipo correto

@Component({
  selector: 'app-partner-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partner-account.component.html',
  styleUrls: ['./partner-account.component.scss'],
})
export class PartnerAccountComponent {
  @Input() user?: partner;
  @Output() userChange = new EventEmitter<partner>();

  editUser?: partner;
  editProfileMode = false;
  addOfferMode = false;
  editOfferMode = false;
  offerForm: any = {
    id: '',
    title: '',
    description: '',
    active: true
  };
  editingOfferIndex: number | null = null;

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
        this.user = { ...(this.user as partner), photoUrl: reader.result as string };
        this.userChange.emit(this.user);
      };
      reader.readAsDataURL(file);
    }
  }

  addOffer() {
    this.offerForm = { id: '', title: '', description: '', active: true };
    this.addOfferMode = true;
    this.editOfferMode = false;
    this.editingOfferIndex = null;
  }

  editOffer(offer: any, index: number) {
    this.offerForm = { ...offer };
    this.editOfferMode = true;
    this.addOfferMode = false;
    this.editingOfferIndex = index;
  }

  saveOffer() {
    if (!this.user) return;
    const partner = this.user as partner;
    if (this.addOfferMode) {
      this.offerForm.id = Date.now().toString();
      partner.offer = [...(partner.offer || []), { ...this.offerForm }];
    } else if (this.editOfferMode && this.editingOfferIndex !== null) {
      partner.offer[this.editingOfferIndex] = { ...this.offerForm };
    }
    this.userChange.emit(this.user);
    this.cancelOfferForm();
  }

  cancelOfferForm() {
    this.addOfferMode = false;
    this.editOfferMode = false;
    this.offerForm = { id: '', title: '', description: '', active: true };
    this.editingOfferIndex = null;
  }

  removeOffer(offer: any) {
    if (!this.user) return;
    const partner = this.user as partner;
    if (confirm('Remover esta oferta?')) {
      partner.offer = partner.offer.filter((o: any) => o.id !== offer.id);
      this.userChange.emit(this.user);
    }
  }

  get partnerUser(): partner | undefined {
    return this.user?.role === 'partner' ? this.user as partner : undefined;
  }
}
