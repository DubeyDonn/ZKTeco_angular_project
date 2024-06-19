import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftComponent } from './shift/shift.component';
import { authGuard } from '../../helpers/auth/auth.guard';

const routes: Routes = [
  { path: 'shift', component: ShiftComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
