# dashkit

Source of the Angular library `@geodienst/dashkit`: reusable components for map dashboards.
Installation and setup in an app: see [the package README](projects/geodienst/dashkit/README.md).

## Create your own dashboard (no programming needed)

1. Install Node 26, Git and an AI coding assistant (e.g. Claude Code). It must be able to edit files and run commands; a plain chat AI isn't enough.
2. Clone this repository and start the AI assistant in its folder.
3. Say: "I want to create a dashboard." If it doesn't pick up the instructions by itself, tell it to read `docs/create-dashboard/INSTRUCTIONS.md`.

Have ready: your data (e.g. a Google Sheet with coordinates), the texts you want to show, and a logo.
The AI asks you what the dashboard should show and builds it step by step. If something isn't possible yet, it tells you and suggests an alternative.

## Development

```powershell
npm ci          # install dependencies
npm test        # unit tests (Vitest)
npm run build   # builds the package to dist/geodienst/dashkit
```

Releasing a new version: see "Release" in [CLAUDE.md](CLAUDE.md).
