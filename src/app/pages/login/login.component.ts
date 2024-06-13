import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawerContainer } from '@angular/material/sidenav';
// import { MatContainer } from '@angular/material/container';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    MatDrawerContainer,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  protected form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (response.success) {
          this.storageService.saveUser(response.data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;

          this.router.navigate(['/']);
          //toast message
          this.snackBar.open('Logged In Successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        } else {
          this.errorMessage = response.message;
          this.isLoginFailed = true;

          //toast message
          this.snackBar.open('Login Failed', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      },
      error: (err) => {
        console.error(err.error.message);
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
        this.isLoginFailed = true;

        //toast message
        this.snackBar.open('Login Failed', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
