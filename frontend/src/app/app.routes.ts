import { NgModule } from '@angular/core';
<<<<<<< HEAD
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

// importa o main layout aqui
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from '../app/core/services/auth/auth.guard';


export const routes: Routes = [
  // Rota temporária para testar o QuestionnaireComponent
  {
    path: 'questionnaire',
  loadComponent: () => import('../app/pages/questionnaire/questionnaire.component')
  .then(m => m.QuestionnaireComponent)
  },

<<<<<<< HEAD
  // Main app routes under the main layout (requires authentication)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('../app/pages/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('../app/pages/account/account.component')
          .then(m => m.AccountComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('../app/pages/calendar/calendar.component')
          .then(m => m.CalendarComponent)
      },
      {
        path: 'map',
        loadComponent: () => import('../app/pages/map/map.component')
          .then(m => m.MapComponent)
      },
      {
        path: 'questionnaire',
        loadComponent: () => import('../app/pages/questionnaire/questionnaire.component')
          .then(m => m.QuestionnaireComponent)
      }
    ]
  },

  // Fallback for unknown routes
  { path: '**', redirectTo: 'login' }
=======
  // Fallback para redirecionar qualquer outra rota para o componente de teste
  { path: '**', redirectTo: 'questionnaire' }
>>>>>>> 5b356c8a2c25de59c334ac95afebecc67c3e952e
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }