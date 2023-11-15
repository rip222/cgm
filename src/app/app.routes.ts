import { Routes } from '@angular/router';
import { commitsResolver } from '@lib/feature/commits';

export const routes: Routes = [
  {
    path: 'repos',
    loadComponent: () =>
      import('@lib/feature/repos').then((c) => c.ReposComponent),
  },
  {
    path: 'commits',
    loadComponent: () =>
      import('@lib/feature/commits').then((c) => c.CommitsComponent),
    resolve: { commits: commitsResolver },
  },
  {
    path: '**',
    redirectTo: '/repos',
    pathMatch: 'full',
  },
];
