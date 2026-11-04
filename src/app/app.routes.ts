import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/agendamento/agendamento.component').then(m => m.AgendamentoComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
