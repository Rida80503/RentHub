import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Authentication guard that protects routes from unauthenticated access.
 *
 * Checks whether the user is logged in before allowing navigation.
 * If the user is not logged in, redirects them to the login page.
 *
 * @returns `true` if the user is authenticated; otherwise, returns
 * a URL tree that redirects the user to the login page.
 */
export const authGuard: CanActivateFn = () => {
  // Inject the authentication service to check the user's login status.
  const authService = inject(AuthService);

  // Inject the router to handle redirection.
  const router = inject(Router);

  // Allow access if the user is logged in.
  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect unauthenticated users to the login page.
  return router.createUrlTree(['/login']);
};