
import { Routes } from '@angular/router';

import { Home } from './features/properties/home/home';
import { PropertyForm } from './features/properties/property-form/property-form';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { LandlordDashboard } from './features/landlord/landlord-dashboard/landlord-dashboard';
import { PropertyDetails } from './features/properties/property-details/property-details';

import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

export const routes: Routes = [
  {
    // Public home page; landlords are redirected to access denied.
    path: '',
    component: Home,
    canActivate: [roleGuard],
    data: { tenantOnly: true },
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    // Landlord dashboard.
    path: 'landlord/dashboard',
    component: LandlordDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'landlord' },
  },
  {
    // Create a property.
    path: 'landlord/properties/new',
    component: PropertyForm,
    canActivate: [authGuard, roleGuard],
    data: { role: 'landlord' },
  },
  {
    // Edit a property.
    path: 'landlord/properties/edit/:id',
    component: PropertyForm,
    canActivate: [authGuard, roleGuard],
    data: { role: 'landlord' },
  },
  {
    // Property details; existing access behavior is preserved for now.
    path: 'property-details',
    component: PropertyDetails,
  },
  {
    // Access denied page.
    path: 'access-denied',
    loadComponent: () =>
      import('./features/auth/access-denied/access-denied')
        .then(m => m.AccessDenied),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
