import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  private forms: any[] = [];

  saveForm(form: any) {
    this.forms.push(form);
  }

  getForms() {
    return this.forms;
  }
}


// utilizando o serviço no componente:

    // constructor(private questionnaireService: QuestionnaireService) {}

    // ngOnInit() {
    //   this.formularios = this.questionnaireService.getForms();
    // }