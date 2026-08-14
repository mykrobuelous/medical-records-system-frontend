# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Frontend for a Medical Records System (doctor-facing app for logging in and managing patients/consultations). Early-stage: only a login flow is implemented so far. Built with React 19 + TypeScript + Vite, Redux Toolkit (RTK Query) for API state, Tailwind CSS v4, react-hook-form + zod for forms, and react-router v8.

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

- `src/features/<FeatureName>/` — one folder per screen/feature (e.g. `LoginPage`). Inside, a `<FeatureName>Layout.tsx` component holds the page markup/logic, and a `schema/` subfolder holds zod schemas + inferred types for that feature's forms.
- `src/shared/` — everything reused across features:
  - `api/` — RTK Query setup. `baseApi.ts` defines the single `createApi` instance (empty `endpoints: () => ({})`); each feature injects its own endpoints via `baseApi.injectEndpoints(...)` in `api/endpoints/<name>Endpoint.ts` and re-exports the generated hooks (see `loginEndpoint.ts`). Do not create additional `createApi` instances — always inject into `baseApi`.
  - `components/` — generic, presentation-only UI primitives (`Button`, `Input`). These are intentionally unstyled/minimal scaffolds — extend props via `className` + `twMerge`, don't fork new components for one-off styling.
  - `data/` — shared TypeScript types: `api.types.ts` has the `ApiResponse<T>` discriminated union (`{status:'ok', data, message?}` | `{status:'error', message, errors?}`) that all endpoint responses should be wrapped in; `data.types.ts` has domain models (`PatientType`, `ConsultationType`).
  - `layout/` — app shell: `ProviderLayout` wraps the app in the Redux `<Provider>`; `AppLayout` owns the `react-router` `<Routes>` table. `App.tsx` composes `ProviderLayout > AppLayout`.
  - `store/` — single Redux store (`configureStore`) wiring in `baseApi.reducer`/`baseApi.middleware`. Exports typed `useAppDispatch`/`useAppSelector` — use these instead of the raw `react-redux` hooks.
  - `utils/idUtils.ts` — `IDBrand` is a branded `string` type for entity IDs (prevents mixing raw strings with IDs); `generateID()` produces one via `uuid`. Use `IDBrand` for all entity `id`/`*Id` fields instead of `string`.

### Conventions

- Path alias `@` → `src` is configured in `vite.config.ts`, but the codebase currently uses relative imports everywhere — follow the existing relative-import style unless doing a broader migration.
- RTK Query mutations/queries return `ApiResponse<T>`; unwrap with `.unwrap()` in the component and branch on thrown errors for the `status: 'error'` case (see `LoginPageLayout.tsx`).
- Forms use `react-hook-form` with `zodResolver`, backed by a schema in the feature's `schema/` folder that also exports the inferred `*SchemaType`.
- Styling is Tailwind v4 (config lives in CSS via `@theme`/`@utility` in `src/index.css` and `src/shared/styles/utilStyles.css`, not a `tailwind.config.js`). Custom utilities (`box`, `box-center`, `flex-center`, `view-screen`, `view-full`, `grow-item-1`, `grow-item-2`, `item-shadow`) are defined in `utilStyles.css` — prefer them over ad hoc equivalents. Merge/override classes with `twMerge`, never string concatenation.
- Prettier is configured with `prettier-plugin-tailwindcss` (auto-sorts class names), single quotes, semicolons, 4-space indentation, 100 print width — run through Prettier/format-on-save rather than hand-formatting.
