import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})

export class QuestionnaireComponent {
  dados = {
    age: null,
    weight: null,
    health: '',
    sleep: '',
    food: '',
    id: '',
    vaccine: '',
    disease: ''
  };

  verificarElegibilidade() {
    const { age, weight, health, sleep, food, id, vaccine, disease } = this.dados;

    if (
      age >= 16 &&
      age <= 69 &&
      weight > 50 &&
      health === 'yes' &&
      sleep === 'yes' &&
      food === 'no' &&
      id === 'yes' &&
      vaccine === 'yes' &&
      disease === 'no'
    ) {
      Swal.fire('Você está elegível para doar sangue.');
    } else {
      Swal.fire('Que pena!\nVocê está inelegível para doar sangue.');
    }
  }

  sair() {
    // Aqui você pode redirecionar via Angular ou simular logout
    window.location.href = '/tela-login/telalogin.html';
  }
}
