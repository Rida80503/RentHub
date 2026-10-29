import { Routes } from '@angular/router';

// Import components displayed for their corresponding routes.
import { Home } from './features/properties/home/home';
import { PropertyForm } from './features/properties/property-form/property-form';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { LandlordDashboard } from './features/landlord/landlord-dashboard/landlord-dashboard';
import { PropertyDetails } from './features/properties/property-details/property-details';

// Import guards that control authentication and role-based access.
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

/**
 * Defines the application's URL routes and the components they display.
 * Protected landlord routes require authentication and the landlord role.
 */
export const routes: Routes = [
  {
    // Home page displayed at the root URL.
    path: '',
    component: Home,
  },
  {
    // Login page for existing users.
    path: 'login',
    component: Login,
  },
  {
    // Registration page for new users.
    path: 'register',
    component: Register,
  },
  {
    // Landlord dashboard, accessible only to authenticated landlords.
    path: 'landlord/dashboard',
    component: LandlordDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'landlord' },
  },
  {
    // Form for creating a new property listing.
    path: 'landlord/properties/new',
    component: PropertyForm,
    canActivate: [authGuard, roleGuard],
    data: { role: 'landlord' },
  },
  {
    // Form for editing an existing property, identified by its ID.
    path: 'landlord/properties/edit/:id',
    component: PropertyForm,
    canActivate: [authGuard, roleGuard],
    data: { role: 'landlord' },
  },
  {
    // Displays property details.
    path: 'property-details',
    component: PropertyDetails,
  },
  {
    // Redirects unknown URLs to the home page.
    path: '**',
    redirectTo: '',
  },
];