import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { authGuard } from '../../helpers/auth/auth.guard';

const routes: Routes = [
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeManagementRoutingModule {}
