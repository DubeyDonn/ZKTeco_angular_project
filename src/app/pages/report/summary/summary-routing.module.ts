import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { MonthlySummaryComponent } from './monthly-summary/monthly-summary.component';
import { authGuard } from '../../../helpers/auth/auth.guard';

const routes: Routes = [
  {
    path: 'monthly',
    component: MonthlySummaryComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryRoutingModule {}
