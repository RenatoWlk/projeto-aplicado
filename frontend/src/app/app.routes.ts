import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // Rota temporária para testar o QuestionnaireComponent
  {
    path: 'questionnaire',
  loadComponent: () => import('../app/pages/questionnaire/questionnaire.component')
  .then(m => m.QuestionnaireComponent)
  },

  // Fallback para redirecionar qualquer outra rota para o componente de teste
  { path: '**', redirectTo: 'questionnaire' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }