import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 👈 importar CommonModule

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 adicionar aqui
})
export class QuestionnaireComponent {
  form: FormGroup;
  resultado: string = '';
  perguntasInvalidas: string[] = [];

  constructor(private fb: FormBuilder) {
    console.log("questionnaire component carregado.")
    this.form = this.fb.group({
      idade: ['', Validators.required],
      doacaoAntesDos60: ['', Validators.required],
      peso: ['', Validators.required],
      saudavel: ['', Validators.required],
      gravida: ['', Validators.required],
      amamentando: ['', Validators.required],
      partoRecente: ['', Validators.required],
      sintomas: ['', Validators.required],
      doencas: ['', Validators.required],
      medicamentos: ['', Validators.required],
      procedimentos: ['', Validators.required],
      drogas: ['', Validators.required],
      parceiros: ['', Validators.required],
      tatuagem: ['', Validators.required],
      homemUltimaDoacao: ['', Validators.required],
      mulherUltimaDoacao: ['', Validators.required],
      vacinaCovid: ['', Validators.required],
      vacinaFebre: ['', Validators.required],
      viagemRisco: ['', Validators.required]
    });
  }

  onSubmit() {
    this.perguntasInvalidas = [];
    this.resultado = '';

    for (const controlName in this.form.controls) {
      const control = this.form.get(controlName);
      if (control?.value === 'Sim') {
        this.perguntasInvalidas.push(controlName);
      }
    }

    if (this.perguntasInvalidas.length === 0) {
      this.resultado = 'Você está apto(a) para doar sangue. Procure o hemocentro mais próximo.';
    } else {
      this.resultado = 'Você está temporariamente ou definitivamente inapto(a) para doar sangue devido às seguintes respostas:';
    }
  }
}
