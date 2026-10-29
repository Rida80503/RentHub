import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * Defines the application-wide configuration for the Angular application.
 * Registers global error listeners and configures client-side routing.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Registers listeners for uncaught browser-level errors.
    provideBrowserGlobalErrorListeners(),

    // Configures Angular Router using the application's route definitions.
    provideRouter(routes),
  ],
};