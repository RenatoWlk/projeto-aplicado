import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon';
import { BloodType } from '../dashboard/dashboard.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatStepperModule, MatRadioModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    MatIconModule
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  selectedOption: string = '';


  ngOnInit(): void {
    this.userForm = this.fb.group({
      userType: ['', Validators.required],
      credentials: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmed_password: ['', [Validators.required, Validators.minLength(6)]],
      }),
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
        gender: ['', Validators.required],
        bloodtype: ['', Validators.required],
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