
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { UserRole } from '../shared/models/user.model';

/**
 * Protects routes based on the authenticated user's role.
 *
 * Supports:
 * - Role-specific routes using data.role
 * - Tenant-only routes using data.tenantOnly
 */
export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const expectedRole = route.data['role'] as UserRole | undefined;
  const tenantOnly = route.data['tenantOnly'] === true;

  // Allow logged-out users to access public pages.
  // Protected routes should also use authGuard.
  if (!user) {
    if (expectedRole || tenantOnly) {
      return router.createUrlTree(['/login']);
    }

    return true;
  }

  // Block landlords from tenant-only pages.
  if (tenantOnly && user.role !== 'tenant') {
    return router.createUrlTree(['/access-denied']);
  }

  // Redirect users whose role does not match the route requirement.
  if (expectedRole && user.role !== expectedRole) {
    const correctRoute =
      user.role === 'landlord' ? '/landlord/dashboard' : '/';

    return router.createUrlTree([correctRoute]);
  }

  return true;
};
