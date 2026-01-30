# signals-demo

Angular 19 app demonstrating **signals**, signal-based stores, and modern reactive patterns.

## Features

- **Todos** – todo list with signal store
- **Counter** – simple counter with signals
- **Effect logger** – `effect()` usage and logging
- **Greeter** – input-bound greeting with signals
- **Contact** – contact form demo
- **Teams** – team list and detail (uses mock API)

## Project structure

- `src/app/core/` – app-wide infrastructure (layout, notifications, theme stores)
- `src/app/shared/` – reusable UI and utilities (e.g. notifications list)
- `src/app/features/` – one folder per feature (todos, counter, greeter, teams, etc.)

## Development server

```bash
npm start
# or
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app reloads on file changes.

For **Teams** (and any `/api` calls), run the mock API in another terminal:

```bash
cd dev/mock-api && npm install && npm start
```

The app proxies `/api` to `http://localhost:3000` (see `proxy.conf.json`). Use `ng serve` with the default config so the proxy is applied.

## Build

```bash
ng build
```

Output goes to `dist/`. Production build is optimized by default.

## SSR

After building:

```bash
npm run serve:ssr:signals-demo
```

## Tests

```bash
ng test
```

Runs unit tests with Karma.

## Resources

- [Angular CLI](https://angular.dev/tools/cli)
- [Angular Signals](https://angular.dev/guide/signals)
