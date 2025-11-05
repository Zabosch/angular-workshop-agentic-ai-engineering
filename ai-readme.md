# AI: Technology & Dependencies

This file summarizes the technology stack and package-level dependencies used by the project in this repository.

## Summary

- Framework: Angular (v20.x)
- Language: TypeScript (v5.x)
- State & data: RxJS, @ngrx/signals, @tanstack/angular-query-experimental
- UI: Angular Material, Angular CDK
- Styling: Tailwind CSS + PostCSS and a custom Angular Material theme
- Local/test server dependency: Express (used by local or demo API)
- Testing: Playwright Test
- Tooling: Angular CLI, Prettier

## Important package versions (from `package.json`)

Dependencies:

- @angular/animations: 20.2.1
- @angular/cdk: 20.2.0
- @angular/common: 20.2.1
- @angular/compiler: 20.2.1
- @angular/core: 20.2.1
- @angular/forms: 20.2.1
- @angular/material: ^20.2.0
- @angular/platform-browser: 20.2.1
- @angular/platform-server: 20.2.1
- @angular/router: 20.2.1
- @angular/ssr: 20.2.1
- @angular-architects/ngrx-toolkit: ^20.1.0
- @ngrx/signals: 20.0.1
- @tanstack/angular-query-experimental: ^5.85.5
- express: 5.1.0
- rxjs: 7.8.0
- tslib: 2.3.0
- zone.js: 0.15.0

Dev dependencies:

- @angular/build: 20.2.0
- @angular/cli: 20.2.0
- @angular/compiler-cli: 20.2.1
- @playwright/test: ^1.55.0
- @tailwindcss/postcss: 4.1.12
- @types/express: ^5.0.1
- @types/node: ^20.17.19
- postcss: 8.5.6
- prettier: 3.6.2
- tailwindcss: 4.1.12
- typescript: 5.9.2

## Tooling & scripts

Key npm scripts (see `package.json`):

- `npm start` — runs `ng serve` to start the dev server
- `npm run build` — runs `ng build` to produce production artifacts
- `npm test` — runs the configured test runner (unit tests)
- `npm run format.write` — runs Prettier to format source files

Configuration files to inspect for further details:

- `angular.json` — Angular workspace/project configuration
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json` — TypeScript configuration
- `playwright.config.ts` — Playwright test configuration
- `src/styles.css` and `src/material-theme.scss` — global styling and Material theme
- `.postcssrc.json` or `postcss.config.js` — PostCSS configuration (Tailwind integration)

## Notes and how dependencies are used

- Angular v20 is used across core packages — this project follows the current Angular major version for runtime, compilation, and CLI tooling.
- State/data libraries: The repo includes both NgRx-related tooling (`@angular-architects/ngrx-toolkit`) and `@ngrx/signals`; additionally an experimental TanStack Query integration (`@tanstack/angular-query-experimental`) is present, indicating a hybrid or experimental approach to state and server-state management.
- Styling: Tailwind v4 is integrated alongside Angular Material. PostCSS is used for processing Tailwind utilities and the project also provides an SCSS Material theme file.
- Express is included as a dependency; it may be used for a demo/local API server (the README references `npx bookmonkey-api` for the fake API).
- Playwright Test is configured for browser-based tests; check `tests/` and `tests-examples/` for example specs.

## Recommended developer environment

- Node.js (LTS recommended; test with Node 18/20+)
- npm (the project uses npm scripts shown above)
- VS Code with Angular Language Service and Prettier as recommended in the main `README.md`

## How to inspect dependency tree locally

1. Install dependencies:

```powershell
npm install
```

2. Show dependency tree (npm):

```powershell
npm ls --depth=0
```

3. List devDependencies only:

```powershell
npm ls --depth=0 --dev
```

## Security & maintenance notes

- Keep Angular and TypeScript up-to-date within major compatibility constraints. Follow the official Angular upgrade guide when bumping major versions.
- Regularly run `npm audit` and patch vulnerabilities as appropriate.

---

This file was generated to summarize the project's technology choices and the top-level package dependencies. For a deeper architecture or API documentation, see `architecture.md` or ask the project maintainer for additional details.
