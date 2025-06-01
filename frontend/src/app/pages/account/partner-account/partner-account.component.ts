import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PartnerUser, Offer, AccountService, PartnerRequestDTO, OfferDTO } from '../account.service';

@Component({
  selector: 'app-partner-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-account.component.html',
  styleUrls: ['./partner-account.component.scss'],
})
export class PartnerAccountComponent implements OnInit {
  @Input() user?: PartnerUser;
  @Output() userChange = new EventEmitter<PartnerUser>();

  // Estados do componente
  editProfileMode = false;
  addOfferMode = false;
  editOfferMode = false;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Formulários
  profileForm!: FormGroup;
  offerForm!: FormGroup;
  
  editingOfferIndex: number | null = null;

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
      cnpj: ['', [Validators.required, this.cnpjValidator]],
      description: [''],
      website: ['']
    });

    this.offerForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      active: [true],
      validUntil: [''],
      discount: [''],
      termsAndConditions: ['']
    });
  }

  private setupProfileForm() {
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: this.user.address,
        phone: this.user.phone,
        cnpj: this.user.cnpj,
        description: this.user.description || '',
        website: this.user.website || ''
      });
    }
  }

  // === CUSTOM VALIDATORS ===
  private phoneValidator(control: any) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  private cnpjValidator(control: any) {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(control.value) ? null : { invalidCnpj: true };
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
      const updateData: PartnerRequestDTO = this.profileForm.value;
      
      // Para desenvolvimento, atualizar localmente
      this.user = { ...this.user, ...updateData };
      this.userChange.emit(this.user);
      this.editProfileMode = false;
      
      // Quando tiver backend integrado:
      // const updatedUser = await this.accountService.updatePartner(this.user.id, updateData).toPromise();
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
      // const response = await this.accountService.uploadPartnerPhoto(this.user.id, file).toPromise();
      // this.user = { ...this.user, photoUrl: response.photoUrl };
      // this.userChange.emit(this.user);
      
    } catch (error) {
      this.error = 'Erro ao fazer upload da foto. Tente novamente.';
      console.error('Erro no upload:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // === OFFER METHODS ===
  addOffer() {
    this.offerForm.reset({
      title: '',
      description: '',
      active: true,
      validUntil: '',
      discount: '',
      termsAndConditions: ''
    });
    this.addOfferMode = true;
    this.editOfferMode = false;
    this.editingOfferIndex = null;
    this.clearMessages();
  }

  editOffer(offer: Offer, index: number) {
    this.offerForm.patchValue({
      title: offer.title,
      description: offer.body,
      active: offer.active,
      validUntil: offer.validUntil || '',
      discount: offer.discountPercentage || '',
      termsAndConditions: offer.termsAndConditions || ''
    });
    this.editOfferMode = true;
    this.addOfferMode = false;
    this.editingOfferIndex = index;
    this.clearMessages();
  }

  async saveOffer() {
    if (!this.offerForm.valid || !this.user) {
      this.markFormGroupTouched(this.offerForm);
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      const offerData: OfferDTO = this.offerForm.value;
      
      if (this.addOfferMode) {
        const newOffer: Offer = {
          id: Date.now().toString(),
          partnerName: this.user.name,
          title: offerData.title,
          body: offerData.body,
          active: offerData.active,
          validUntil: offerData.validUntil,
          discountPercentage: offerData.discountPercentage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.user.offers = [...(this.user.offers || []), newOffer];
        this.showSuccess('Oferta criada com sucesso!');
        
        // Quando tiver backend integrado:
        // const createdOffer = await this.accountService.addOffer(this.user.id, offerData).toPromise();
        // this.user.offer = [...this.user.offer, createdOffer];
        
      } else if (this.editOfferMode && this.editingOfferIndex !== null) {
        // Editar oferta existente
        const offerId = this.user.offers[this.editingOfferIndex].id;
        const updatedOffer: Offer = {
          id: offerId,
          partnerName: this.user.name,
          title: offerData.title,
          body: offerData.body,
          active: offerData.active,
          validUntil: offerData.validUntil,
          discountPercentage: offerData.discountPercentage,
          createdAt: this.user.offers[this.editingOfferIndex].createdAt,
          updatedAt: new Date().toISOString()
        };
        this.user.offers[this.editingOfferIndex] = updatedOffer;
        this.showSuccess('Oferta atualizada com sucesso!');
        
        // Quando tiver backend integrado:
        // const updatedOffer = await this.accountService.updateOffer(this.user.id, offerId, offerData).toPromise();
        // this.user.offer[this.editingOfferIndex] = updatedOffer;
      }
      
      this.userChange.emit(this.user);
      this.cancelOfferForm();
      
    } catch (error) {
      this.error = 'Erro ao salvar oferta. Tente novamente.';
      console.error('Erro ao salvar oferta:', error);
    } finally {
      this.isLoading = false;
    }
  }

  cancelOfferForm() {
    this.addOfferMode = false;
    this.editOfferMode = false;
    this.offerForm.reset();
    this.editingOfferIndex = null;
    this.clearMessages();
  }

  async removeOffer(offer: Offer) {
    if (!this.user || !confirm('Tem certeza que deseja remover esta oferta?')) return;

    this.isLoading = true;
    this.clearMessages();

    try {
      this.user.offers = this.user.offers.filter((o: Offer) => o.id !== offer.id);
      this.userChange.emit(this.user);
      this.showSuccess('Oferta removida com sucesso!');
      
      // Quando tiver backend integrado:
      // await this.accountService.deleteOffer(this.user.id, offer.id).toPromise();
      
    } catch (error) {
      this.error = 'Erro ao remover oferta. Tente novamente.';
      console.error('Erro ao remover oferta:', error);
    } finally {
      this.isLoading = false;
    }
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
  get partnerUser(): PartnerUser | undefined {
    return this.user?.role === 'PARTNER' ? this.user as PartnerUser : undefined;
  }

  get profileFormControls() {
    return this.profileForm.controls;
  }

  get offerFormControls() {
    return this.offerForm.controls;
  }

  get hasOffers(): boolean {
    return !!(this.user?.offers && this.user.offers.length > 0);
  }

  get offersCount(): number {
    return this.user?.offers?.length || 0;
  }

  get activeOffersCount(): number {
    return this.user?.offers?.filter((offer: Offer) => offer.active).length || 0;
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
      if (field.errors['invalidCnpj']) {
        return 'Formato: 00.000.000/0000-00';
      }
    }
    
    return null;
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  // === UTILITY METHODS ===
  formatCurrency(value: string): string {
    if (!value) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  }

  isOfferExpired(offer: Offer): boolean {
    if (!offer.validUntil) return false;
    return new Date(offer.validUntil) < new Date();
  }

  getOfferStatus(offer: Offer): string {
    if (!offer.active) return 'Inativa';
    if (this.isOfferExpired(offer)) return 'Expirada';
    return 'Ativa';
  }

  getOfferStatusClass(offer: Offer): string {
    if (!offer.active) return 'status-inactive';
    if (this.isOfferExpired(offer)) return 'status-expired';
    return 'status-active';
  }
}