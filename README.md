# RentHub — Rental Property Listing Application

RentHub is a responsive Angular web application designed to simplify the process of browsing rental properties and managing property listings. The application provides a dedicated experience for tenants and landlords, with role-based navigation, property details, authentication, and property listing management.

The project demonstrates Angular standalone components, TypeScript, client-side routing, route guards, reusable services, form validation, and browser-based data persistence.

## Project Links

- **GitHub Repository:** https://github.com/Rida80503/RentHub
- **Live Application:** https://ephemeral-platypus-b2dc0d.netlify.app/

## Features

### Property Browsing
- Browse available rental properties.
- View individual property details.
- Display default property images when listing photos are unavailable.
- Access property information through dedicated listing and detail views.

### Authentication and User Roles
- Register a new user account.
- Log in to the application.
- Separate tenant and landlord experiences.
- Use Angular route guards to restrict protected routes based on authentication and user roles.

### Landlord Property Management
- Access a dedicated landlord dashboard.
- Create new property listings through a property form.
- Edit existing property listings.
- Validate form fields before submitting property information.

### Data and User Experience
- Store property and demo data in browser `localStorage`.
- Manage property-related operations through an Angular service.
- Support property comments and replies through the property service.
- Provide a responsive interface with keyboard focus indicators.

*Feature availability should be confirmed against the final deployed version before submission.*

## Technology Stack

| Technology | Purpose |
|---|---|
| Angular | Frontend application framework |
| TypeScript | Application logic and type safety |
| HTML | Component templates and page structure |
| CSS | Styling and responsive layouts |
| Angular Router | Navigation and route management |
| Angular Route Guards | Authentication and role-based route protection |
| Angular Services | Property data and application logic |
| localStorage | Browser-based persistence for demo data |
| Angular Testing Utilities | Component and service testing |
| Netlify | Frontend deployment and hosting |
| Git and GitHub | Version control and source code hosting |

## Application Architecture

RentHub uses a feature-oriented Angular structure that separates authentication, property management, shared models, and application services.

- **Core:** Authentication service and route guards.
- **Features:** Login, registration, landlord dashboard, property listing, property details, and property form.
- **Services:** Property data management and related operations.
- **Shared Models:** TypeScript models for users and properties.
- **Application Configuration:** Routes, providers, and application bootstrap configuration.

This structure helps keep the application organized and makes individual features easier to maintain and extend.

## User Roles

### Tenant
- Browse available rental properties.
- View property details.
- Register and log in to the application.

### Landlord
- Access the landlord dashboard after authentication.
- Create property listings.
- Edit existing property listings.

Access to protected landlord routes is controlled by authentication and role guards.

## Demo Credentials

Use the following demo account to explore the landlord features of RentHub.

| Role      | Email / Username        | Password           |
| Landlord | `landlord1@renthub.demo` | `DemoLandlord@123` |



## Project Structure

```text
renthub/
├── public/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   └── role.guard.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── landlord/
│   │   │   │   └── landlord-dashboard/
│   │   │   └── properties/
│   │   │       ├── home/
│   │   │       ├── property-details/
│   │   │       └── property-form/
│   │   ├── services/
│   │   │   ├── property.service.ts
│   │   │   └── property.service.spec.ts
│   │   ├── shared/
│   │   │   └── models/
│   │   │       ├── property.model.ts
│   │   │       └── user.model.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   └── app.spec.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore
```

## Folder Structure Overview

| Folder / File | Purpose |
|---|---|
| `public/` | Contains static assets served by the application. |
| `src/app/core/` | Contains authentication logic, the authentication service, and route guards. |
| `src/app/features/auth/` | Contains login and registration components for user authentication. |
| `src/app/features/landlord/` | Contains the landlord dashboard for managing property listings. |
| `src/app/features/properties/home/` | Displays the home page and available rental properties. |
| `src/app/features/properties/property-details/` | Displays detailed information about an individual property. |
| `src/app/features/properties/property-form/` | Contains the form used to create and edit property listings. |
| `src/app/services/` | Contains services for property data management and related operations. |
| `src/app/shared/models/` | Defines TypeScript models and interfaces for users and properties. |
| `src/app/app.routes.ts` | Defines application routes and navigation between features. |
| `src/app/app.config.ts` | Configures application-wide providers and Angular settings. |
| `src/app/app.ts` | Contains the root application component logic. |
| `src/app/app.html` | Contains the root application component template. |
| `src/app/app.css` | Contains styling for the root application component. |
| `src/main.ts` | Bootstraps the Angular application. |
| `src/styles.css` | Contains global application styles. |
| `angular.json` | Configures Angular build, development server, and testing settings. |
| `package.json` | Defines project dependencies and npm scripts. |
| `package-lock.json` | Records the resolved dependency versions for consistent installations. |
| `tsconfig.json` | Contains TypeScript compiler configuration. |
| `.gitignore` | Specifies files and directories Git should ignore. |
| `README.md` | Documents project features, setup, architecture, testing, and deployment. |

### Key Design Notes

- **Feature-based organization:** Authentication, landlord functionality, and property pages are separated into their own feature folders.
- **Separation of responsibilities:** Services manage application data operations, while shared models define data structures.
- **Route protection:** Authentication and role guards help restrict access to protected routes.
- **Standalone Angular structure:** The application uses standalone-style configuration and routing rather than requiring a traditional root NgModule.


## Getting Started

### Prerequisites

Install the following tools before running the application:

- Node.js and npm
- Git
- A compatible Angular CLI (or use the project's local CLI through `npx`)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Rida80503/RentHub.git
```

**2. Open the project directory**

```bash
cd RentHub
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npx ng serve
```

**5. Open the application**

Visit:

http://localhost:4200/

The development server watches for changes and rebuilds the application as you update the source files.

## Build and Testing

### Production Build

Generate an optimized production build:

```bash
npm run build
```

The Angular build output is generated under:

```text
dist/renthub/browser/
```

### Unit Tests

The repository includes Angular component and service test files.

Run the project's test command:

```bash
npx ng test
```

Confirm the test results in your environment before reporting a passing test count in a submission.

## Deployment

RentHub is deployed on Netlify and connected to the GitHub repository.

- **Hosting platform:** Netlify
- **Source branch:** `main`
- **Build command:** `npm run build`
- **Publish directory:** `dist/renthub/browser`

### Deployment Verification

After deployment, verify that:

- The home page loads correctly.
- Registration and login work as expected.
- Tenant and landlord navigation behaves correctly.
- Property details and listing forms function correctly.
- Refreshing a nested route does not produce a 404 error.
- The layout remains usable on desktop and mobile devices.

Live application: https://ephemeral-platypus-b2dc0d.netlify.app/

## Demo Accounts

Add dedicated demo accounts here only after creating and testing them on the deployed application.

| Role | Email / Username | Password |
|---|---|---|
| Tenant | Add verified demo account | Add verified demo password |
| Landlord | Add verified demo account | Add verified demo password |

Do not publish personal credentials or passwords reused for other services.

## Current Limitations

- Property and demo data are stored in browser `localStorage`.
- Browser-based storage is local to the user's browser and is not a shared database.
- A production-ready multi-user application would require a secure backend, persistent database, and server-side authentication and authorization.

These limitations should be considered when evaluating the application for real-world rental management.

## Future Improvements

Potential improvements include:

- Integrating a backend API and database.
- Adding property image uploads.
- Introducing property search, filtering, and sorting.
- Implementing secure server-side authentication and authorization.
- Adding automated end-to-end tests.
- Improving accessibility and mobile usability.

## Author and Project Information

**Project:** RentHub — Rental Property Listing Application  
**Framework:** Angular  
**Language:** TypeScript  
**Repository:** https://github.com/Rida80503/RentHub  
**Live Demo:** https://ephemeral-platypus-b2dc0d.netlify.app/

---

*This README describes the current application structure and intended functionality. Update it whenever the implementation, testing results, demo accounts, or deployment configuration changes.*
