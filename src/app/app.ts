import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Defines the root component of the RentHub application.
 * Provides the router outlet used to display the component
 * associated with the currently active route.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}