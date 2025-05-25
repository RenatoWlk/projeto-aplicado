import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatStepperModule, MatRadioModule],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userType: ['', Validators.required],
      credentials: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      }),
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
        birthdate: ['', Validators.required],
      }),
    });
  }

  get credentialsGroup() {
    return this.userForm.get('credentials') as FormGroup;
  }

  get personalInfoGroup() {
    return this.userForm.get('personalInfo') as FormGroup;
  }

  submit() {
    console.log('Formulário enviado:', this.userForm.value);
  }
}