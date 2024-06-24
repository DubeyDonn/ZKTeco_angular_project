import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { authGuard } from './helpers/auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DailyAttendanceComponent } from './pages/daily-attendance/daily-attendance.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'products/:productId',
        component: ProductDetailComponent,
        canActivate: [authGuard],
      },
      {
        path: 'products',
        component: ProductListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'daily-attendance',
        component: DailyAttendanceComponent,
        canActivate: [authGuard],
      },
      {
        path: 'setup',
        loadChildren: () =>
          import('./pages/setup/setup.module').then((m) => m.SetupModule),
        canActivate: [authGuard],
      },

      {
        path: 'office-management',
        loadChildren: () =>
          import('./pages/office-management/office-management.module').then(
            (m) => m.OfficeManagementModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'attendance-insight',
        loadChildren: () =>
          import('./pages/attendance-insight/attendance-insight.module').then(
            (m) => m.AttendanceInsightModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./pages/report/report.module').then((m) => m.ReportModule),
        canActivate: [authGuard],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
