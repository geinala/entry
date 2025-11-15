# My React Vite Template with TanStack Query, TanStack Router, shadcn/ui, Husky and Feature-Sliced Design

This is a modern React template project built with Vite, _featuring Progressive Web App (PWA) support_ (cooming soon), TanStack Query (React Query), TanStack Router, shadcn/ui, Husky and following [Feature-Sliced Design](https://feature-sliced.github.io/documentation/) for a scalable and developer-friendly front-end setup.

## Features

- **Vite:** Fast build tool for an optimized development experience.

- **Progressive Web App (PWA):** Offline support, app-like installation, and service worker integration (planned).

- **TanStack Query:** Efficient API data fetching and state management.

- **TanStack Router:** Type-safe declarative routing for seamless navigation.

- **shadcn/ui:** Customizable, accessible UI components for rapid development.

- **TypeScript:** Type-safe code for improved maintainability.

- **Tailwind CSS:** Utility-first CSS framework for quick UI styling.

- **ESLint & Prettier:** Ensure code quality and consistent formatting.

- **Husky:** Git hooks for automated linting and formatting before commits.

- **Zod:** Schema validation for forms (e.g., login form validation).

## Prerequisites

Make sure you have installed:

- Node.js (v18 or higher)

- Corepack (recommended, or use npm/yarn/pnpm)

## Project Structure

```
├── app
│   ├── error
│   │   ├── model
│   │   ├── types
│   │   └── ui
│   ├── layouts
│   ├── providers
│   ├── routes
│   │   ├── (admin)
│   │   │   ├── dashboard
│   │   │   ├── ....
│   │   └── (public)
│   │   │   └── auth
│   │   │        └── sign-in
│   │   │        └── ....
│   │   │   └── ....
│   └── styles
├── config
├── entities
│   ├── <slice>
│   │   └── api
│   │   └── model
│   │   └── ui
│   └── ....
├── features
│   ├── <slice>
│   │   └── api
│   │   └── model
│   │   └── ui
│   └── ....
├── pages
│   ├── (admin)
│   └── (public)
│   └── ....
├── shared
│   ├── api
│   ├── helpers
│   ├── hooks
│   ├── lib
│   ├── stores
│   ├── types
│   ├── ui
│   └── utils
│   └── ....
└── widgets
    ├── <widget>
    ├── ....
```

#### Key Configurations

- `/app`: Entry point of the application. Contains error boundaries, global providers, layouts, routing, and global styles.

- `/entities`: Represents main domain objects (e.g., user, role, permission). Each entity contains API, model (state, logic), and UI parts.

- `/features`: Reusable business logic or flows (e.g., auth/sign-in, filter, admin features).

- `/pages`: Route-level components mapped to URLs. Can compose entities, features, and widgets.

- `/widgets`: Complex, reusable UI blocks (e.g., data-table, form, sidebar, admin components).

- `/shared`: Global reusable resources — API client, hooks, helpers, UI primitives, utils, and state stores.

- `/config`: App-wide configuration files.

## Routing

- Public routes (e.g., `auth/sign-in`) are located in `src/app/routes/(public)`.

- Admin routes (dashboard, permissions, roles) are in `src/app/routes/(admin)`.

- TanStack Router generates type-safe routes with `pnpm routes:generate`.

## Data Fetching (TanStack Query)

- Query Client is defined in `src/shared/lib/tanstack-query`.

- Wrapped in QueryClientProvider under `src/app/providers`.

- Fetch data using `useQuery` and `useMutation`.

## UI Layer (shadcn/ui + Tailwind)

- Pre-installed shadcn/ui components under `src/shared/ui`.

- Tailwind CSS is configured in `tailwind.config.js`.

- Global styles are under `src/app/styles`.

## Form Validation (Zod)

- Example: login schema with Zod in `src/features/auth/sign-in/model`.

## Husky

- Git hooks are set up in `.husky`.

- Automatically runs `lint`, `format`, `build`, and etc on commit.

## Featured-Slice Design

This project follows [Feature-Sliced Design (FSD)](https://feature-sliced.github.io/documentation/), a front-end architecture pattern that divides the app into layers and slices for scalability and maintainability.

<p align="center">
  <img src="https://github.com/user-attachments/assets/8bb6ffdb-0996-4e2d-aa44-3ac74016cfa9" width="200" height="800" />
</p>

### Decision Trees

To help guide where logic, types, or UI should be placed, this project includes decision tree diagrams:

#### Logic Decision Tree

![Logic](https://github.com/user-attachments/assets/48f106c1-9045-4e56-91e8-dd7c76a5d288)

#### Types Decision Tree

![Types](https://github.com/user-attachments/assets/7fad0560-9312-4b13-8e8c-c247aa6ac828)

#### UI Component Decision Tree

![UI Component](https://github.com/user-attachments/assets/5f3bc58c-1aed-4ce1-afaf-f9bc27e71c6a)

These diagrams serve as practical references when deciding in which layer (entities, features, widgets, shared) a piece of code should live.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/vunky-himawan/react-vite-template.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

Open http://localhost:5173 in your browser to view the app.

4. Build for production:

```bash
pnpm build
```

Production files are generated in the dist folder.

5. Preview the production build:

```bash
pnpm preview
```

## Scripts

- `pnpm dev`: Start the development server.

- `pnpm build`: Build the app for production.

- `pnpm preview`: Preview the production build.

- `pnpm routes:generate`: Generate route files using TanStack Router.

- `pnpm prepare`: Run Husky hooks.

- `pnpm lint`: Run ESLint to check code quality.

<br>

<hr>

<p align="center"><b>Generated By Artificial Intelligence</b></p>
