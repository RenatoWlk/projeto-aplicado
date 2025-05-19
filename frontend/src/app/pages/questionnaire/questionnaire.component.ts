import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { QuestionnaireService } from '../services/questionnaire.service';


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
  perguntasLabels: { [key: string]: string } = {
    idade: 'Idade entre 16 e 69 anos',
    sexo: 'Sexo',
    doacaoAntesDos60: 'Já doou sangue antes dos 60 anos',
    peso: 'Pesa mais de 50kg',
    saudavel: 'Está saudável hoje',
    gravida: 'Está grávida',
    partoRecente: 'Teve parto nos últimos 12 meses',
    sintomas: 'Está com sintomas infecciosos',
    doencas: 'Teve doenças graves',
    medicamentos: 'Está tomando medicamentos',
    procedimentos: 'Fez procedimentos recentes',
    drogas: 'Usa drogas ilícitas injetáveis',
    parceiros: 'Teve múltiplos parceiros sexuais',
    tatuagem: 'Fez tatuagem nos últimos 12 meses',
    homemUltimaDoacao: 'Homem: doou sangue há menos de 2 meses',
    mulherUltimaDoacao: 'Mulher: doou sangue há menos de 3 meses',
    vacinaCovid: 'Tomou vacina COVID-19 nos últimos 7 dias',
    vacinaFebre: 'Tomou vacina febre amarela nos últimos 30 dias',
    viagemRisco: 'Viajou para área de risco de malária'
  };
  submitted = false;
  sucessoPreenchimento = false;

  constructor(private fb: FormBuilder, private questionnaireService: QuestionnaireService) {
    console.log("questionnaire component carregado.")
    this.form = this.fb.group({
      sexo: ['', Validators.required],
      idade: ['', Validators.required],
      doacaoAntesDos60: ['', Validators.required],
      peso: ['', Validators.required],
      saudavel: ['', Validators.required],
      gravida: ['', Validators.required],
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
    this.submitted = true;
    this.sucessoPreenchimento = false;
    this.perguntasInvalidas = [];
    this.resultado = '';

    const simInvalida = [
      'gravida', 'partoRecente', 'sintomas', 'doencas',
      'medicamentos', 'procedimentos', 'drogas', 'parceiros', 'tatuagem',
      'vacinaCovid', 'vacinaFebre', 'viagemRisco', 'homemUltimaDoacao', 
      'mulherUltimaDoacao'
    ];

    const naoInvalida = [
      'idade', 'doacaoAntesDos60', 'peso', 'saudavel'
    ];

    const sexo = this.form.get('sexo')?.value;
    let camposRelevantes = [
      'idade', 'sexo', 'doacaoAntesDos60', 'peso', 'saudavel',
      'sintomas', 'doencas', 'medicamentos', 'procedimentos', 'drogas',
      'parceiros', 'tatuagem', 'vacinaCovid', 'vacinaFebre', 'viagemRisco'
    ];

    if (sexo === 'masculino') {
      camposRelevantes.push('homemUltimaDoacao');
    }
    if (sexo === 'feminino') {
      camposRelevantes.push('gravida', 'partoRecente', 'mulherUltimaDoacao');
    }

    const naoRespondidas = camposRelevantes.filter(
      key => !this.form.get(key)?.value
    );

    if (naoRespondidas.length > 0) {
      this.resultado = 'Por favor, responda todas as perguntas antes de enviar o formulário.';
      this.perguntasInvalidas = naoRespondidas;
      return;
    }

    this.sucessoPreenchimento = true;

    for (const controlName of camposRelevantes) {
      const control = this.form.get(controlName);
      if (
        (simInvalida.includes(controlName) && control?.value === 'Sim') ||
        (naoInvalida.includes(controlName) && control?.value === 'Não')
      ) {
        this.perguntasInvalidas.push(controlName);
      }
    }

    if (this.perguntasInvalidas.length === 0) {
      this.resultado = 'Parabéns! Você está apto(a) para doar sangue. Procure o hemocentro mais próximo.';
    } else {
      this.resultado = 'Você está temporariamente ou definitivamente inapto(a) para doar sangue devido às seguintes respostas:';
    }
    this.questionnaireService.saveForm(this.form.value);
  }

  responderNovamente() {
    this.form.reset();
    this.submitted = false;
    this.sucessoPreenchimento = false;
    this.resultado = '';
    this.perguntasInvalidas = [];
  }
}
