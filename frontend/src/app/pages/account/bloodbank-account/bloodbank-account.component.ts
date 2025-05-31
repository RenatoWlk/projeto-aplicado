import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BloodBankUser, AccountService, Campaign, CampaignRequest, BloodBankUpdateRequest } from '../account.service';

@Component({
  selector: 'app-bloodbank-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bloodbank-account.component.html',
  styleUrls: ['./bloodbank-account.component.scss'],
})
export class BloodBankAccountComponent implements OnInit {
  @Input() user?: BloodBankUser;
  @Output() userChange = new EventEmitter<BloodBankUser>();

  // Estados do componente
  editProfileMode = false;
  addCampaignMode = false;
  editCampaignMode = false;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Formulários
  profileForm!: FormGroup;
  campaignForm!: FormGroup;
  
  editingCampaignIndex: number | null = null;

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

    this.campaignForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      active: [true],
      priority: ['MEDIUM'],
      startDate: [''],
      endDate: [''],
      targetBloodTypes: [[]]
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
      const updateData: BloodBankUpdateRequest = this.profileForm.value;
      
      // Para desenvolvimento, atualizar localmente
      this.user = { ...this.user, ...updateData };
      this.userChange.emit(this.user);
      this.editProfileMode = false;
      
      // Quando tiver backend integrado:
      // const updatedUser = await this.accountService.updateBloodBank(this.user.id, updateData).toPromise();
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
      // const response = await this.accountService.uploadBloodBankPhoto(this.user.id, file).toPromise();
      // this.user = { ...this.user, photoUrl: response.photoUrl };
      // this.userChange.emit(this.user);
      
    } catch (error) {
      this.error = 'Erro ao fazer upload da foto. Tente novamente.';
      console.error('Erro no upload:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // === CAMPAIGN METHODS ===
  addCampaign() {
    this.campaignForm.reset({
      title: '',
      description: '',
      active: true,
      priority: 'MEDIUM',
      startDate: '',
      endDate: '',
      targetBloodTypes: []
    });
    this.addCampaignMode = true;
    this.editCampaignMode = false;
    this.editingCampaignIndex = null;
    this.clearMessages();
  }

  editCampaign(campaign: Campaign, index: number) {
    this.campaignForm.patchValue({
      title: campaign.title,
      description: campaign.description,
      active: campaign.active,
      priority: campaign.priority || 'MEDIUM',
      startDate: campaign.startDate || '',
      endDate: campaign.endDate || '',
      targetBloodTypes: campaign.targetBloodTypes || []
    });
    this.editCampaignMode = true;
    this.addCampaignMode = false;
    this.editingCampaignIndex = index;
    this.clearMessages();
  }

  async saveCampaign() {
    if (!this.campaignForm.valid || !this.user) {
      this.markFormGroupTouched(this.campaignForm);
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      const campaignData: CampaignRequest = this.campaignForm.value;
      
      if (this.addCampaignMode) {
        // Adicionar nova campanha
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          ...campaignData
        };
        
        this.user.campaigns = [...(this.user.campaigns || []), newCampaign];
        this.showSuccess('Campanha criada com sucesso!');
        
        // Quando tiver backend integrado:
        // const createdCampaign = await this.accountService.createCampaign(this.user.id, campaignData).toPromise();
        // this.user.campaigns = [...this.user.campaigns, createdCampaign];
        
      } else if (this.editCampaignMode && this.editingCampaignIndex !== null) {
        // Editar campanha existente
        const campaignId = this.user.campaigns[this.editingCampaignIndex].id;
        this.user.campaigns[this.editingCampaignIndex] = { 
          id: campaignId, 
          ...campaignData 
        };
        this.showSuccess('Campanha atualizada com sucesso!');
        
        // Quando tiver backend integrado:
        // const updatedCampaign = await this.accountService.updateCampaign(this.user.id, campaignId, campaignData).toPromise();
        // this.user.campaigns[this.editingCampaignIndex] = updatedCampaign;
      }
      
      this.userChange.emit(this.user);
      this.cancelCampaignForm();
      
    } catch (error) {
      this.error = 'Erro ao salvar campanha. Tente novamente.';
      console.error('Erro ao salvar campanha:', error);
    } finally {
      this.isLoading = false;
    }
  }

  cancelCampaignForm() {
    this.addCampaignMode = false;
    this.editCampaignMode = false;
    this.campaignForm.reset();
    this.editingCampaignIndex = null;
    this.clearMessages();
  }

  async removeCampaign(campaign: Campaign) {
    if (!this.user || !confirm('Tem certeza que deseja remover esta campanha?')) return;

    this.isLoading = true;
    this.clearMessages();

    try {
      this.user.campaigns = this.user.campaigns.filter(c => c.id !== campaign.id);
      this.userChange.emit(this.user);
      this.showSuccess('Campanha removida com sucesso!');
      
      // Quando tiver backend integrado:
      // await this.accountService.deleteCampaign(this.user.id, campaign.id).toPromise();
      
    } catch (error) {
      this.error = 'Erro ao remover campanha. Tente novamente.';
      console.error('Erro ao remover campanha:', error);
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
  get bloodBankUser(): BloodBankUser | undefined {
    return this.user?.role === 'BLOODBANK' ? this.user as BloodBankUser : undefined;
  }

  get profileFormControls() {
    return this.profileForm.controls;
  }

  get campaignFormControls() {
    return this.campaignForm.controls;
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

  // === PRIORITY OPTIONS ===
  priorityOptions = [
    { value: 'LOW', label: 'Baixa' },
    { value: 'MEDIUM', label: 'Média' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'URGENT', label: 'Urgente' }
  ];

  // === BLOOD TYPE OPTIONS ===
  bloodTypeOptions = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  // === HELPER PARA LABELS ===
  getPriorityLabel(priority: string): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : priority;
  }
}