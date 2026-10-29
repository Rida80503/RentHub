import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { UserRole } from '../shared/models/user.model';

/**
 * Protects routes based on the authenticated user's role.
 *
 * Checks whether the user is logged in and whether their role matches
 * the role specified in the route's data. Unauthenticated users are
 * redirected to the login page, while users with the wrong role are
 * redirected to an appropriate route.
 *
 * @param route - The route being activated, including its role metadata.
 * @returns True if access is allowed; otherwise, a UrlTree for redirection.
 */
export const roleGuard: CanActivateFn = route => {
  // Inject the authentication service to retrieve the current user.
  const authService = inject(AuthService);

  // Inject the router to handle redirects when access is denied.
  const router = inject(Router);

  // Get the currently authenticated user.
  const user = authService.getCurrentUser();

  // Read the role required by this route, if one is configured.
  const expectedRole = route.data['role'] as UserRole | undefined;

  // Redirect unauthenticated users to the login page.
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  // Redirect users whose role does not match the route requirement.
  if (expectedRole && user.role !== expectedRole) {
    const correctRoute =
      user.role === 'landlord' ? '/landlord/dashboard' : '/';

    return router.createUrlTree([correctRoute]);
  }

  // Allow navigation if authentication and role checks pass.
  return true;
};