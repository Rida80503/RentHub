import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

/**
 * Login component for RentHub.
 *
 * Provides a reactive login form, validates user input, authenticates
 * credentials through AuthService, and redirects users according to
 * their account role.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  // Inject dependencies required for form handling, authentication, and navigation.
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Tracks whether the user has attempted to submit the form.
  submitted = false;

  // Stores the error message displayed when login fails.
  errorMessage = '';

  // Define the login form and its validation rules.
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  /**
   * Provides access to the individual login form controls.
   *
   * @returns The controls belonging to the login form.
   */
  get controls() {
    return this.loginForm.controls;
  }

  /**
   * Handles login form submission.
   *
   * Marks invalid fields as touched, authenticates valid credentials,
   * and redirects the user based on their role. Displays an error
   * message if authentication or role identification fails.
   */
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop submission if the form does not pass validation.
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Retrieve the entered email and password.
    const { email, password } = this.loginForm.getRawValue();

    // Authenticate the user and display an error if credentials are invalid.
    if (!this.authService.login(email, password)) {
      this.errorMessage = 'Invalid email or password.';
      return;
    }

    // Retrieve the authenticated user's information.
    const user = this.authService.getCurrentUser();

    // Redirect landlords to their dashboard.
    if (user?.role === 'landlord') {
      this.router.navigate(['/landlord/dashboard']);
    } else if (user?.role === 'tenant') {
      // Redirect tenants to the home page.
      this.router.navigate(['/']);
    } else {
      // Clear the session if the account role cannot be identified.
      this.authService.logout();
      this.errorMessage = 'Unable to identify your account role.';
    }
  }
}