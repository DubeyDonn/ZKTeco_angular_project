import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../helpers/auth/auth.guard';
import { DailyAttendanceInsightComponent } from './daily-attendance-insight/daily-attendance-insight.component';

const routes: Routes = [
  {
    path: 'daily',
    component: DailyAttendanceInsightComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceInsightRoutingModule {}
