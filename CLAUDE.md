# dashkit

Angular library `@geodienst/dashkit`: reusable components for map dashboards (MapLibre map, filters, legend, lists, tables, dialogs), based on Angular Material.
The components come from the first app that uses the package.

- `projects/geodienst/dashkit/` – the library
  - `src/lib/<component>/` – one folder per component
  - `src/lib/locale/messages.<lang>.xlf` – translations of the component texts, shipped as `locale/` in the package
  - `src/public-api.ts` – everything the main entry point exports; a new component must be added here
  - `testing/src/` – secondary entry point `@geodienst/dashkit/testing` (MapLibre stubs for app tests)
  - `package.json` – the package manifest: name, version, peer dependencies
- `package.json` (root) – the workspace: dev tooling and the packages needed to build and test; never published

```powershell
npm test        # unit tests (Vitest)
npm run build   # builds the package to dist/geodienst/dashkit
```

## Components

Every component is used by several dashboards, so:

- **No app-specific knowledge:** no domain types, no data loading, no knowledge of a particular data source.
  Data comes in via inputs (use generic types, e.g. `T` plus a label/key function), events go out via outputs.
- **Wiring stays in the app:** loading data, mapping columns and choosing what to show happens in the app, not inside a component.
- **No dashboard-specific text or config:** titles, labels, icons etc. are passed in as inputs.
  Generic UI text of the component itself (e.g. "Close", "No results") may use `i18n` with an id prefixed by the component name (`@@itemList.noResults`).
- **Theme-agnostic styling:** only `var(--mat-sys-*)` tokens and Material CSS tokens, so the component adapts to the app's theme.
- **Self-contained tests:** specs use their own small test data.
- **Self-contained folder:** a component and everything it needs (template, styles, spec, helper types) live in its own folder.
- **Selector prefix `gd`:** `gd-…` for components, `gd…` for directives.
- **Public API:** a new component is exported in `src/public-api.ts`. Renaming or removing an input, output or selector is a breaking change (see Release).

If a component can't reasonably be made generic in the current step, say so in one sentence instead of over-engineering it.

## Test-driven development (mandatory)

Every change to behaviour starts with a test. No exceptions, also not for "small" changes.

1. **Red:** write or extend a test that describes the wanted behaviour. Then stop and ask the user to run `npm test`.
   The user runs all tests; never run them yourself.
2. Only continue when the user confirms the test fails **for the expected reason** (the assertion, not a compile or setup error).
   A test that has never been seen failing proves nothing.
3. **Green:** write the minimal code that makes the test pass. Nothing more. Ask the user to run `npm test` again.
4. **Refactor:** clean up only while tests stay green.

If a test is green although it should be red, treat it as a bug and find the cause before continuing.

Pure refactorings (no behaviour change) and config/styling changes need no new test, but existing tests must stay green.

### Testing notes

- Vitest + jsdom via `ng test`. Spec files live next to the code: `<name>.spec.ts`.
- `$localize` comes from the `@angular/localize/init` polyfill of the test target in `angular.json`.
- jsdom has no WebGL, so MapLibre components (`mgl-map`, `mgl-marker`) are replaced by the stubs from `testing/src/map-view.stubs.ts` (`stubMapLibre()`).
- jsdom has no `matchMedia`; specs that need it stub it with `vi.stubGlobal('matchMedia', …)`.
- `tsconfig.spec.json` maps `@geodienst/dashkit` and `…/testing` to the sources, so the tests run without a build.

## Styling

Always use Angular Material. The theme comes from the app, so never define one in the library.

- Use Material components (`mat-toolbar`, `mat-form-field`, `mat-select`, …) instead of plain HTML controls.
- Take colors, fonts, shapes and elevation from the theme's system tokens (`var(--mat-sys-*)`), never hard-coded values.
- Adjust Material components through their CSS tokens (e.g. `--mat-toolbar-container-background-color`), not by overriding their internal classes.

## Translations

Angular i18n (`@angular/localize`), source language English, languages de, fr, es, tr, bg, el.
The files in `src/lib/locale/` are written by hand, there is no extraction tooling.
Apps load them before their own translation files, so an app can override any component text with the same id.

- When a change adds user-visible text, ask the user whether it should be translated.
- If yes: mark it with `i18n` / `i18n-<attr>` and a custom id prefixed with the component name (`@@itemList.search`), and add the id to `messages.xlf` and every `messages.<lang>.xlf`.
- A new language means a new `messages.<lang>.xlf`.

## Plans

Keep plans short, show only the very important things. Per step:

- one sentence: what and why
- **Red:** the key assertion line(s) of the test, plus any setup change it needs
- **Green:** the key line(s) per changed file (ts/css), no boilerplate
- HTML templates (component templates and test host templates) always as fenced ```html code blocks, so the structure of the components is visible
- end with "Run `npm test` after each Red and each Green."

No full test bodies, no alternatives, no long context section.

## YAGNI

- Build only what the current step needs. No speculative options, abstractions, config or error handling for cases that do not exist yet.
- Prefer the simplest code that passes the test. The user will ask for more when it is needed.
- Don't add dependencies unless the step cannot reasonably be done without them.
  A new runtime dependency is either a peer dependency (the app provides it) or, if apps don't use it themselves, a dependency listed in `allowedNonPeerDependencies` in `angular.json`.
- If something would be worth adding, mention it in one sentence instead of building it.

## Release

Versions follow semver. Breaking changes (renamed or removed inputs, outputs, selectors) bump the major version; in 0.x the minor version counts as breaking.
Angular updates: the library is updated first (peer dependency ranges, release), then the apps.

1. Bump `version` in `projects/geodienst/dashkit/package.json`.
2. Update `CHANGELOG.md`.
3. Commit and push, then `git tag v<version>` and `git push --tags`.
4. CI (`.github/workflows/ci.yml`) tests, builds and packs the tag, stages it on npmjs.com (trusted publishing, no token) and creates a GitHub release with the tarball attached. It fails if the tag doesn't match the version.
5. The user approves the staged version with 2FA. Only then it is live. Either:
   - in the npmjs.com UI: on the package page (logged in), approve the staged version, or
   - on the command line: `npm stage list @geodienst/dashkit`, then `npm stage approve <stage-id>`.
6. The apps update with `npm install @geodienst/dashkit@<version>`.

A version can't be published twice: if a release fails after it reached npm, bump the version.

## Git

Work in small commits, one step each. The user usually commits themselves, so don't offer to commit; commit only when the user asks.

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Angular components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
