import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HoursShortfallComponent } from './hours-shortfall/hours-shortfall.component';
import { authGuard } from '../../../helpers/auth/auth.guard';

const routes: Routes = [
  {
    path: 'hours',
    component: HoursShortfallComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShortfallRoutingModule {}
