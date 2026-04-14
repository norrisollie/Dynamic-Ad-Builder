# Project Guidelines

## Code Style
- Follow the existing Prettier configuration in each size folder (`.prettierrc`): 4 spaces, semicolons, double quotes, trailing commas (`es5`), max line width 80.
- Keep function/module naming consistent with existing patterns: `build*`, `handle*`, `format*`, and camelCase exports.
- Prefer short, direct inline comments. Add longer comments only when they prevent real confusion.

## Architecture
- Treat each size folder as an independent Parcel project with the same architecture.
- Main entry flow: `src/index.html` -> `src/scripts/script.js`.
- Keep responsibilities separated:
  - `handleEnvironment.js`: choose dynamic data source by environment.
  - `buildGlobalElements.js` / `buildFrameElements.js`: create and place DOM nodes.
  - `buildFrames.js` / `handleAnimation.js` / `scripts/animation/*`: frame timeline and motion.
  - `scripts/elements/*`: element-level creation/formatting behavior.
  - `scripts/utilities/*`: shared helper utilities.

## Build And Test
- Install dependencies per size folder: `npm install`
- Dev run: `npm run start:dev`
- Example run: `npm run start:example`
- Live run: `npm run start:live`
- Build variants:
  - `npm run build:development`
  - `npm run build:example`
  - `npm run build:live`
- Cleanup utilities:
  - `npm run clean:dist`
  - `npm run clean:output`
  - `npm run clean:cache`
  - `npm run clean:all`

## Conventions
- Always set or preserve the intended `CREATIVE_ENV` value. Environment routing drives which feed loader is used.
- Do not remove or bypass `parcel-namer-nohash.js`; no-hash output names are required for the ad workflow.
- Avoid changing Parcel `parcelIgnore`/`staticFiles` behavior unless requested; asset copying relies on this setup.
- Prebuild scripts may remove both local and parent `.parcel-cache`. Be careful when running multiple size folders in parallel.
- Keep `Enabler` initialization flow intact in `script.js` (`Enabler.isInitialized()`, `Enabler.isVisible()` checks).
- Use `src/scripts/environments/template-notes-160x600.md` as the source of truth for 160x600 template keys, frame usage, and feed column patterns.

## Key Reference Files
- `package.json`
- `parcel-namer-nohash.js`
- `src/scripts/script.js`
- `src/scripts/handleEnvironment.js`
- `src/scripts/environments/template-notes-160x600.md`
- `src/scripts/buildGlobalElements.js`
- `src/scripts/utilities/utilities.ts`
