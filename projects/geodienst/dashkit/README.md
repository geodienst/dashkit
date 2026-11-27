# @geodienst/dashkit

Angular components for map dashboards: a MapLibre map, filters, legend, lists, tables and dialogs, based on Angular Material.
All components use the `gd-` selector prefix. `src/public-api.ts` lists everything the package exports.

## Installation

Requires Angular 22.3 or newer with Angular Material.

```powershell
npm install @geodienst/dashkit
npm install @angular/material @angular/cdk @angular/localize @maplibre/ngx-maplibre-gl maplibre-gl
```

## Setup

`angular.json`, in the app's `build` options:

```json
"assets": [
  { "glob": "maplibre-gl-{worker,shared}.mjs", "input": "node_modules/maplibre-gl/dist", "output": "maplibre" },
  { "glob": "messages.*.xlf", "input": "node_modules/@geodienst/dashkit/locale", "output": "locale/components" }
],
"styles": ["node_modules/maplibre-gl/dist/maplibre-gl.css", "src/theme.scss"],
"polyfills": ["@angular/localize/init"]
```

- `src/theme.scss` is the app's Angular Material theme. The components take all colors and fonts from it.
- `main.ts` tells MapLibre where its worker is: `setWorkerUrl('maplibre/maplibre-gl-worker.mjs')` (from `maplibre-gl`).

## Translations

The component texts are translated into de, fr, es, tr, bg and el. The package ships them as `locale/messages.<lang>.xlf`.

- With runtime translations, the app fetches `locale/components/messages.<lang>.xlf` and passes them to `loadTranslations` before it bootstraps.
  Load the app's own files afterwards: a text with the same id then overrides the component text.
- With build-time translations, add the package file first in `i18n.locales`:

  ```json
  "de": ["node_modules/@geodienst/dashkit/locale/messages.de.xlf", "src/locale/messages.de.xlf"]
  ```

## Tests in the app

jsdom has no WebGL, so app tests replace the MapLibre components with stubs:

```ts
import { stubMapLibre } from '@geodienst/dashkit/testing';
```
