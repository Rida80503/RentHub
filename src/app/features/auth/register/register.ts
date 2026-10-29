import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { UserRole } from '../../../shared/models/user.model';

/**
 * Validates that the password and confirmation password match.
 *
 * @param control - The form group containing both password fields.
 * @returns A passwordMismatch error if the values differ;
 * otherwise, null.
 */
function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  // Retrieve the password values from the form group.
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  // Skip comparison until both fields contain values.
  if (!password || !confirmPassword) {
    return null;
  }

  // Return a validation error if the passwords do not match.
  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
}

/**
 * Registration component for RentHub.
 *
 * Collects account details, validates user input, registers the user,
 * signs them in after successful registration, and redirects them
 * according to their selected account role.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  // Inject dependencies for form creation, authentication, and navigation.
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Stores registration errors and tracks submission attempts.
  errorMessage = '';
  submitted = false;

  // Define the registration form and its validation rules.
  readonly registerForm = this.fb.nonNullable.group(
    {
      // Full name
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
          Validators.pattern(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/),
        ],
      ],

      // Email
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(254),
          Validators.pattern(
            /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/,
          ),
        ],
      ],

      // Phone number: Indian 10-digit mobile number
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/),
        ],
      ],

      // Password
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/,
          ),
        ],
      ],

      // Confirm password
      confirmPassword: ['', [Validators.required]],

      // Account role
      role: ['tenant' as UserRole, [Validators.required]],
    },
    // Apply password matching validation to the entire form group.
    { validators: passwordMatchValidator },
  );

  /**
   * Provides access to the individual registration form controls.
   *
   * @returns The controls belonging to the registration form.
   */
  get controls() {
    return this.registerForm.controls;
  }

  /**
   * Handles registration form submission.
   *
   * Validates the form, registers the new user, attempts to log them in,
   * and navigates to the appropriate page based on their role.
   */
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop submission when the form contains invalid values.
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Retrieve the validated registration details.
    const { name, email, phone, password, role } =
      this.registerForm.getRawValue();

    // Register the user with their phone number
    const registered = this.authService.register(
      name,
      email,
      password,
      role,
      phone,
    );

    // Display an error if registration fails.
    if (!registered) {
      this.errorMessage =
        'An account with this email already exists, or the registration details are invalid.';
      return;
    }

    // Log the user in after successful registration
    const loggedIn = this.authService.login(email, password);

    // Redirect to login if automatic authentication fails.
    if (!loggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // Navigate according to account role
    if (role === 'landlord') {
      this.router.navigate(['/landlord/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}