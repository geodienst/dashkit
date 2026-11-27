# @geodienst/dashkit

Building blocks for map dashboards: a map with markers, filters, a legend, lists, tables and dialogs.

## Create your own dashboard (no programming needed)

1. Install the AI assistant [OpenCode](https://opencode.ai) and connect it to an AI provider when it asks. It works on your computer, so it can build the dashboard for you.
   Other AI coding assistants (e.g. Claude Code) work too; a plain chat AI like ChatGPT in the browser isn't enough.
2. Create an empty folder for your dashboard and open it in OpenCode.
3. Paste this message:

   > Make sure Git and Node 26 are installed, and install them if not. Then read <https://raw.githubusercontent.com/geodienst/dashkit/master/docs/create-dashboard/INSTRUCTIONS.md> and follow it. I want to create a dashboard.

Have ready: your data (e.g. a Google Sheet with coordinates), the texts you want to show, and a logo.
The AI asks you what the dashboard should show and builds it step by step. If something isn't possible yet, it tells you and suggests an alternative.

## For developers

Everything below is for developers, and for the AI assistant that builds a dashboard for you. If you don't program, you can stop reading here.

Angular components based on Angular Material and MapLibre. All components use the `gd-` selector prefix. [`src/public-api.ts`](https://github.com/geodienst/dashkit/blob/master/projects/geodienst/dashkit/src/public-api.ts) lists everything the package exports.

### Installation

Requires Angular 22.3 or newer with Angular Material.

```powershell
npm install @geodienst/dashkit
npm install @angular/material @angular/localize maplibre-gl
```

npm installs the other peer dependencies automatically. The second line adds the ones the app uses directly (see *Setup*) to its own `package.json`.

### Setup

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

### Translations

The component texts are translated into de, fr, es, tr, bg and el. The package ships them as `locale/messages.<lang>.xlf`.

- With runtime translations, the app fetches `locale/components/messages.<lang>.xlf` and passes them to `loadTranslations` before it bootstraps.
  Load the app's own files afterwards: a text with the same id then overrides the component text.
- With build-time translations, add the package file first in `i18n.locales`:

  ```json
  "de": ["node_modules/@geodienst/dashkit/locale/messages.de.xlf", "src/locale/messages.de.xlf"]
  ```

### Tests in the app

jsdom has no WebGL, so app tests replace the MapLibre components with stubs:

```ts
import { stubMapLibre } from '@geodienst/dashkit/testing';
```
