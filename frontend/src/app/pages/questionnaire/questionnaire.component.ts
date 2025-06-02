import { Component } from '@angular/core';
import { QuestionnaireService, QuestionnaireData } from './questionnaire.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class QuestionnaireComponent {
  form: FormGroup;
  resultado: string = '';
  perguntasInvalidas: string[] = [];
  submitted = false;
  sucessoPreenchimento = false;

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

constructor(
  private fb: FormBuilder,
  private questionnaireService: QuestionnaireService,
  private authService: AuthService
) {
  this.form = this.fb.group({
    sexo: ['', Validators.required],
    idade: ['', Validators.required],
    doacaoAntesDos60: ['', Validators.required],
    peso: ['', Validators.required],
    saudavel: ['', Validators.required],
    gravida: [''],
    partoRecente: [''],
    sintomas: ['', Validators.required],
    doencas: ['', Validators.required],
    medicamentos: ['', Validators.required],
    procedimentos: ['', Validators.required],
    drogas: ['', Validators.required],
    parceiros: ['', Validators.required],
    tatuagem: ['', Validators.required],
    homemUltimaDoacao: [''],
    mulherUltimaDoacao: [''],
    vacinaCovid: ['', Validators.required],
    vacinaFebre: ['', Validators.required],
    viagemRisco: ['', Validators.required]
  });

  this.form.get('sexo')?.valueChanges.subscribe(sexo => {
    if (sexo === 'masculino') {
      this.form.get('homemUltimaDoacao')?.setValidators(Validators.required);
      this.form.get('mulherUltimaDoacao')?.clearValidators();
      this.form.get('gravida')?.clearValidators();
      this.form.get('partoRecente')?.clearValidators();
    } else if (sexo === 'feminino') {
      this.form.get('mulherUltimaDoacao')?.setValidators(Validators.required);
      this.form.get('gravida')?.setValidators(Validators.required);
      this.form.get('partoRecente')?.setValidators(Validators.required);
      this.form.get('homemUltimaDoacao')?.clearValidators();
    } else {
      this.form.get('homemUltimaDoacao')?.clearValidators();
      this.form.get('mulherUltimaDoacao')?.clearValidators();
      this.form.get('gravida')?.clearValidators();
      this.form.get('partoRecente')?.clearValidators();
    }

    // Atualiza os estados dos campos para refletir mudanças nos validadores
    this.form.get('homemUltimaDoacao')?.updateValueAndValidity();
    this.form.get('mulherUltimaDoacao')?.updateValueAndValidity();
    this.form.get('gravida')?.updateValueAndValidity();
    this.form.get('partoRecente')?.updateValueAndValidity();
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
      key => this.form.get(key)?.value === '' || this.form.get(key)?.value === null
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

    const isEligible = this.perguntasInvalidas.length === 0;
    this.resultado = isEligible
      ? 'Parabéns! Você está apto(a) para doar sangue. Procure o hemocentro mais próximo.'
      : 'Você não está elegível para doar sangue neste momento. Veja abaixo os critérios não atendidos:';

    if (this.sucessoPreenchimento) {
      const data: QuestionnaireData = this.form.value;
      this.questionnaireService.submitQuestionnaire(data).subscribe({
        next: () => console.log('Respostas enviadas com sucesso.'),
        error: (err) => console.error('Erro ao enviar respostas:', err)
      });
    }
  }

  responderNovamente() {
    this.form.reset();
    this.submitted = false;
    this.sucessoPreenchimento = false;
    this.perguntasInvalidas = [];
    this.resultado = '';
  }
}
