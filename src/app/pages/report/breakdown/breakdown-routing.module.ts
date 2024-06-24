import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../../helpers/auth/auth.guard';
import { DailyBreakdownComponent } from './daily-breakdown/daily-breakdown.component';
import { WeeklyBreakdownComponent } from './weekly-breakdown/weekly-breakdown.component';
import { MonthlyBreakdownComponent } from './monthly-breakdown/monthly-breakdown.component';
import { BreakdownComponent } from './breakdown.component';

const routes: Routes = [
  {
    path: '',
    component: BreakdownComponent,
    canActivate: [authGuard],
  },
  {
    path: 'daily',
    component: DailyBreakdownComponent,
    canActivate: [authGuard],
  },
  {
    path: 'weekly',
    component: WeeklyBreakdownComponent,
    canActivate: [authGuard],
  },
  {
    path: 'monthly',
    component: MonthlyBreakdownComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreakdownRoutingModule {}
