import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductAlertComponent } from './components/product-alert/product-alert.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './helpers/auth/http-request.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    MatSnackBarModule,
  ],
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductAlertComponent,
    ProductDetailComponent,
    HomeComponent,
  ],
  bootstrap: [AppComponent],
  providers: [provideAnimationsAsync(), httpInterceptorProviders],
})
export class AppModule {}
