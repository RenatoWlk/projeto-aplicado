import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

// importa o main layout aqui
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from '../app/core/services/auth/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('../app/pages/login/login.component')
      .then(m => m.LoginComponent)
  },

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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'top',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
