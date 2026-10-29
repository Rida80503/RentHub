
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 class="text-2xl font-bold text-slate-900">
        Access Denied
      </h1>

      <p class="mt-3 text-slate-600">
        Only tenant can access this page.
      </p>

      <a
        routerLink="/landlord/dashboard"
        class="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">
        Back to Dashboard
      </a>
    </main>
  `,
})
export class AccessDenied {}
