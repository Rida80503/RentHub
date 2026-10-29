import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Starts the Angular application using the root App component
 * and the application-wide configuration.
 *
 * Logs any error that occurs during application startup.
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));