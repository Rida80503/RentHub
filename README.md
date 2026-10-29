# RentHub --- Rental Property Listing Application

RentHub is an Angular web application for browsing rental properties and
managing landlord property listings. It includes role-based navigation
for tenants and landlords, property details, and property listing forms.


## Project Links

-   **GitHub Repository:** `[Add your GitHub repository URL here]`
-   **Live Application:** `[Add your deployed application URL here]`

## Features

-   Browse available rental properties.
-   View property details.
-   Register and log in as a user.
-   Separate tenant and landlord roles.
-   Protect landlord routes using Angular route guards.
-   Create and edit property listings through a property form.
-   Validate form fields before submission.
-   Store property and demo data in browser `localStorage`.
-   Display default property images when a listing has no photos.
-   Provide property comments and replies through the property service.
-   Responsive interface with accessible keyboard focus indicators.

*Only list a feature as complete if it is implemented and working in the
submitted version.*

## Technology Stack

-   **Framework:** Angular
-   **Language:** TypeScript
-   **Markup and styling:** HTML and CSS
-   **Routing:** Angular Router
-   **Testing:** Angular testing utilities
-   **Browser storage:** `localStorage`

## User Roles

### Tenant

-   Browse property listings.
-   Open property details.
-   Register and log in to the application.

### Landlord

-   Access the landlord dashboard after authentication.
-   Create new property listings.
-   Edit existing property listings.

The application uses authentication and role guards to restrict landlord
routes.

## Demo Credentials

Add the credentials for accounts that you have verified on the deployed
application.

  --------------------------------------------------------------------------------------
  Role                    Email / Username              Password
  ----------------------- ----------------------------- --------------------------------
  Landlord                `[landlord1@renthub.demo]`   `[DemoLandlord@123]`
  --------------------------------------------------------------------------------------

> Use dedicated demo accounts only. Do not include personal or reused
> passwords in this README.

## Running the Project Locally

### Prerequisites

-   Node.js and npm installed.
-   Angular CLI compatible with the project version.

### Setup

1.  Clone the repository:

    ``` bash
    git clone [YOUR_GITHUB_REPOSITORY_URL]
    ```

2.  Open the project directory:

    ``` bash
    cd [YOUR_PROJECT_DIRECTORY]
    ```

3.  Install dependencies:

    ``` bash
    npm install
    ```

4.  Start the development server:

    ``` bash
    ng serve
    ```

5.  Open the local URL shown in the terminal (commonly
    `http://localhost:4200/`).

If the Angular CLI is not installed globally, you can run the project's
local CLI using:

``` bash
npx ng serve
```

## Testing

Unit tests are included for selected application components and
services.

Run the test suite with:

``` bash
ng test
```

Before submission, confirm the tests pass in your environment and update
this section if needed. The project requirements call for unit tests
covering at least one component, one service, and one module. If the
application uses standalone Angular components rather than NgModules,
describe the actual tested components/services accurately and confirm
the evaluator's expectations.

## Deployment

Deploy the frontend to a free static hosting provider that supports
Angular builds, such as GitHub Pages, Netlify, or Vercel.

Typical production build command:

``` bash
ng build
```

After deployment, add the public URL under **Project Links** above and
verify that: - The home page loads. - Registration and login work with
the demo accounts. - Route guards behave correctly for each role. -
Property listing and detail pages work. - The application works on
mobile and desktop screen sizes.

## Project Structure

The application is organized by feature and responsibility. The main
areas include:

RENTHUB/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   └── role.guard.ts
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.ts
│   │   │   │   │   ├── login.html
│   │   │   │   │   ├── login.css
│   │   │   │   │   └── login.spec.ts
│   │   │   │   │
│   │   │   │   └── register/
│   │   │   │       ├── register.ts
│   │   │   │       ├── register.html
│   │   │   │       ├── register.css
│   │   │   │       └── register.spec.ts
│   │   │   │
│   │   │   ├── landlord/
│   │   │   │   └── landlord-dashboard/
│   │   │   │       ├── landlord-dashboard.ts
│   │   │   │       ├── landlord-dashboard.html
│   │   │   │       ├── landlord-dashboard.css
│   │   │   │       └── landlord-dashboard.spec.ts
│   │   │   │
│   │   │   └── properties/
│   │   │       ├── home/
│   │   │       │   ├── home.ts
│   │   │       │   ├── home.html
│   │   │       │   ├── home.css
│   │   │       │   └── home.spec.ts
│   │   │       │
│   │   │       ├── property-details/
│   │   │       │   ├── property-details.ts
│   │   │       │   ├── property-details.html
│   │   │       │   ├── property-details.css
│   │   │       │   └── property-details.spec.ts
│   │   │       │
│   │   │       └── property-form/
│   │   │           ├── property-form.ts
│   │   │           ├── property-form.html
│   │   │           ├── property-form.css
│   │   │           └── property-form.spec.ts
│   │   │
│   │   ├── services/
│   │   │   ├── property.service.ts
│   │   │   └── property.service.spec.ts
│   │   │
│   │   ├── shared/
│   │   │   └── models/
│   │   │       ├── property.model.ts
│   │   │       └── user.model.ts
│   │   │
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   └── app.spec.ts
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── README.md
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore

## Folder Structure Overview

The following table describes the main folders and configuration files used in the RentHub application.

| Folder / File | Purpose |
|---|---|
| `core/` | Contains authentication services and route guards for access control. |
| `features/auth/` | Contains the login and registration components. |
| `features/landlord/` | Contains the landlord dashboard for managing property listings. |
| `features/properties/` | Contains the home page, property details, and property form components. |
| `services/` | Contains services for property data management and CRUD operations. |
| `shared/models/` | Contains TypeScript interfaces and data types for users and properties. |
| `app.routes.ts` | Defines application routes and navigation between components. |
| `app.config.ts` | Configures application-wide providers and Angular settings. |
| `README.md` | Provides project documentation, setup instructions, repository links, deployment links, and demo credentials. |
## Notes

-   Property and comment data are stored in browser `localStorage` in
    the current implementation; this is suitable for a demo but is not a
    replacement for a secure production backend.
-   Demo properties may be seeded automatically when the application
    first runs.
-   Update this README to reflect the final deployed version and the
    features you have personally tested.

## Submission Checklist

-   [ ] GitHub repository URL added.
-   [ ] Deployed application URL added and tested.
-   [ ] Demo tenant credentials verified.
-   [ ] Demo landlord credentials verified.
-   [ ] Unit tests run and results checked.
-   [ ] README saved in the repository root.
-   [ ] Any bonus features attempted are listed accurately.
