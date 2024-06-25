import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../helpers/auth/auth.guard';
import { ReportComponent } from './report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    canActivate: [authGuard],
  },
  {
    path: 'breakdown',
    loadChildren: () =>
      import('./breakdown/breakdown.module').then((m) => m.BreakdownModule),
    canActivate: [authGuard],
  },
  {
    path: 'summary',
    loadChildren: () =>
      import('./summary/summary.module').then((m) => m.SummaryModule),
    canActivate: [authGuard],
  },
  {
    path: 'shortfall',
    loadChildren: () =>
      import('./shortfall/shortfall.module').then((m) => m.ShortfallModule),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
