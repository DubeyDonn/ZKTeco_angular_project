import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { merge } from 'rxjs';

@Component({
  selector: 'app-password-form-field',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './password-form-field.component.html',
  styleUrl: './password-form-field.component.css',
})
export class PasswordFormFieldComponent {
  // email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  errorMessage = '';

  constructor() {
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.password.hasError('minlength')) {
      this.errorMessage = 'Password must be at least 8 characters';
    } else {
      this.errorMessage = '';
    }
  }
}
