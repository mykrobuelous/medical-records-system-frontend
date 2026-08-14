# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Frontend for a Medical Records System (doctor-facing app for logging in and managing patients/consultations). Implemented so far: login, an auth-gated dashboard, a patients list + patient detail page, and a consultations list + consultation create/edit form. Built with React 19 + TypeScript + Vite, Redux Toolkit (RTK Query) for API state, Tailwind CSS v4, react-hook-form + zod for forms, and react-router v8. The React Compiler is enabled (via `babel-plugin-react-compiler`, wired into `vite.config.ts` through `@rolldown/plugin-babel`), so avoid manual `useMemo`/`useCallback` micro-optimizations — let the compiler handle memoization.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b (project references) then vite build
npm run lint      # eslint .
npm run preview   # preview the production build
```

There is no test runner configured in this repo (no test script, no test files present).

## Architecture

### Feature-based structure

- `src/features/<FeatureName>/` — one folder per screen/feature (e.g. `LoginPage`, `DashboardPage`, `PatientsPage`, `PatientDetailPage`, `ConsultationsPage`, `NavBar`). Inside, a `<FeatureName>Layout.tsx` component holds the page markup/logic; a `components/` subfolder (when present) holds feature-local subcomponents prefixed with an abbreviation of the feature name plus underscore (e.g. `PatientsPage/components/PP_PatientFormModal.tsx`, `DashboardPage/components/DB_StatCard.tsx`, `NavBar/components/NB_NavItems.tsx`); a `schema/` subfolder holds zod schemas + inferred types for that feature's forms.
- `src/shared/` — everything reused across features:
  - `api/` — RTK Query setup. `baseApi.ts` defines the single `createApi` instance (`baseUrl: 'http://localhost:3000/api'`, `tagTypes: ['Patient', 'Consultation']`, empty `endpoints: () => ({})`) and also exports `providesList`, a helper implementing the standard "list" tag pattern (tags each item by id plus a `LIST` tag) — use it in a query's `providesTags` for any endpoint returning an array, and pair it with `invalidatesTags: [{ type, id: 'LIST' }]` on the corresponding create mutation. Each feature injects its own endpoints via `baseApi.injectEndpoints(...)` in `api/endpoints/<name>Endpoint.ts` and re-exports the generated hooks (see `patientEndpoint.ts` for the full CRUD + tagging pattern). Do not create additional `createApi` instances — always inject into `baseApi`.
  - `components/` — generic, presentation-only UI primitives (`Button`, `Input`, `Select`, `Textarea`, `Modal`, `ConfirmDialog`, `DetailField`, `AllergyBanner`, `ConsultationHistoryList`). These already carry real default styling/variants (e.g. `Button`'s `variant="primary" | "ghost"`) — extend via `className` + `twMerge` rather than forking new components for one-off styling.
  - `data/` — shared TypeScript types: `api.types.ts` has the `ApiResponse<T>` discriminated union (`{status:'ok', data, message?}` | `{status:'error', message, errors?}`) that all endpoint responses should be wrapped in; `data.types.ts` has domain models (`PatientType`, `ConsultationType`).
  - `layout/` — app shell: `ProviderLayout` wraps the app in the Redux `<Provider>`. `AppLayout` owns the `react-router` `<Routes>` table: `/login` is public; every other route (`/`, `/patients`, `/patients/:id`, `/consultations`, `/consultations/new`, `/consultations/:id/edit`) is nested under `AuthGuard` then `MainLayout`. `AuthGuard` checks `localStorage.getItem('token')` and redirects to `/login` when absent (there is no auth slice/state — the token in `localStorage` is the sole source of truth, and `baseApi`'s `prepareHeaders` reads the same key to set the `Authorization: Bearer` header). `MainLayout` renders `NavBarLayout` alongside a scrollable `<Outlet>` content area. `App.tsx` composes `ProviderLayout > AppLayout`.
  - `store/` — single Redux store (`configureStore`) wiring in `baseApi.reducer`/`baseApi.middleware`. Exports typed `useAppDispatch`/`useAppSelector` — use these instead of the raw `react-redux` hooks.
  - `utils/` — `idUtils.ts`: `IDBrand` is a branded `string` type for entity IDs (prevents mixing raw strings with IDs), `generateID()` produces one via `uuid`, `DistributiveOmit<T, K>` is a distributive version of `Omit`. Use `IDBrand` for all entity `id`/`*Id` fields instead of `string`. `dateUtils.ts`: `formatDate`, `isSameDay`, `calculateAge` for ISO date strings. `patientUtils.ts`: `getPatientFullName` for consistent "Last, First Middle" formatting.

### Conventions

- Path alias `@` → `src` is configured in `vite.config.ts`, but the codebase currently uses relative imports everywhere — follow the existing relative-import style unless doing a broader migration.
- RTK Query mutations/queries return `ApiResponse<T>`; unwrap with `.unwrap()` in the component and branch on thrown errors for the `status: 'error'` case (see `LoginPageLayout.tsx`).
- Forms use `react-hook-form` with `zodResolver`, backed by a schema in the feature's `schema/` folder that also exports the inferred `*SchemaType`.
- Styling is Tailwind v4 (config lives in CSS via `@theme`/`@utility` in `src/index.css` and `src/shared/styles/utilStyles.css`, not a `tailwind.config.js`). Custom utilities (`box`, `box-center`, `flex-center`, `view-screen`, `view-full`, `grow-item-1`, `grow-item-2`, `item-shadow`) are defined in `utilStyles.css` — prefer them over ad hoc equivalents. Merge/override classes with `twMerge`, never string concatenation.
- Most component files open with a `// 📦 LIBRARIES IMPORT` comment above the import block and a `/* 🧩 <NAME> - <one-line description> */` banner comment above the component definition — match this convention in new files rather than introducing a different header style.
- Prettier is configured with `prettier-plugin-tailwindcss` (auto-sorts class names), single quotes, semicolons, 4-space indentation, 100 print width — run through Prettier/format-on-save rather than hand-formatting.
