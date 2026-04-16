# Dynamic Ad Builder

A reusable, feed-driven system for building animated HTML5 display ads. Designed primarily for Google Studio, with a modular structure that supports multiple sizes, layouts, strands, and campaign types from a single underlying codebase.

Demo examples use a Royal Navy campaign, but the system is built to be reused across different clients and campaign needs.

---

## Overview

The builder takes structured feed data, processes it through a formatting pipeline, and uses it to construct and animate an ad at runtime. Each ad size is its own Parcel project, with shared conventions across all sizes for scripts, styles, and assets.

The system is intended to be familiar to ad ops and feed-based workflows while offering improved performance, structure, and maintainability.

---

## Key Features

- Feed-driven content — copy, layout, frame order, and timing all controlled via feed data
- Template and strand support — multiple visual layouts handled from the same build
- Environment separation — `dev`, `example`, and `live` environments with tree-shaken output
- GSAP-powered animation — frame sequencing and transitions handled via a shared animation layer
- Modular script architecture — discrete responsibilities across build, format, and animation modules
- Automated build and ZIP packaging — per-environment shell scripts covering all sizes for Studio upload

---

## Tech Stack

- **JavaScript** (vanilla ES modules)
- **HTML / SCSS**
- **[Parcel 2](https://parceljs.org/)** — bundler, with custom namer to strip content hashes from output filenames
- **[GSAP 3](https://greensock.com/gsap/)** — animation
- **Bash** — build and packaging scripts

---

## Project Structure

```
Dynamic-Ad-Builder/
├── 160x600/
├── 300x250/
├── 300x600/
├── 320x250/
├── 320x50/
├── 728x90/
├── 970x250/
│   ├── package.json
│   ├── parcel-namer-nohash.js
│   └── src/
│       ├── index.html
│       ├── assets/
│       │   ├── fonts/
│       │   └── images/
│       ├── scripts/
│       │   ├── script.js               # Entry point — init and ad build orchestration
│       │   ├── formatFeed.js           # Parses raw feed data into structured format
│       │   ├── buildGlobalElements.js  # Builds elements shared across all frames
│       │   ├── buildFrames.js          # Creates frame containers from feed config
│       │   ├── buildFrameElements.js   # Populates each frame with its elements
│       │   ├── handleAnimation.js      # Runs GSAP animation sequences
│       │   ├── handleEnvironment.js    # Resolves the active environment and content handler
│       │   ├── animation/              # Animation templates/sequences
│       │   ├── elements/               # Element builder modules
│       │   ├── environments/           # Per-environment content handlers
│       │   └── utilities/              # Shared utility functions and logging
│       └── styles/
│           ├── style.scss
│           ├── _core.scss
│           ├── _fonts.scss
│           ├── _variables.scss
│           ├── mixins/
│           ├── templates/              # Per-template layout styles
│           └── themes/                 # Per-strand/client theme overrides
├── builds/                             # Output from build scripts
├── build-development-and-zip.sh
├── build-example-and-zip.sh
└── build-live-and-zip.sh
```

Each size directory is a self-contained Parcel project with its own `package.json` and `node_modules`. Script and style conventions are consistent across all sizes.

---

## Environments

Three environments are supported, selected via the `CREATIVE_ENV` variable at build time. `handleEnvironment.js` uses this to resolve the correct content handler, with unused handlers tree-shaken from the output.

| Environment   | Purpose                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `development` | Local testing with hardcoded or stub feed data — safe for shell iteration     |
| `example`     | Client-facing preview build with representative feed content                  |
| `live`        | Production build for Google Studio upload — targets specific browser versions |

Each environment has corresponding `build:*` and `start:*` npm scripts. The `start:*` scripts serve locally via Parcel dev server; the `build:*` scripts produce optimised output in `dist/`.

---

## Build and Packaging Workflow

Three shell scripts handle automated builds across all sizes:

```bash
./build-development-and-zip.sh
./build-example-and-zip.sh
./build-live-and-zip.sh
```

Each script:

1. Iterates through all size directories
2. Cleans Parcel caches and previous output
3. Runs the appropriate `npm run build:*` command
4. Flattens the output structure
5. Removes duplicate font directories (see [Asset Handling](#asset-handling))
6. Packages each size as a ZIP
7. Collects all ZIPs into a timestamped folder under `builds/`

The resulting ZIPs are ready for upload to Google Studio.

---

## Asset Handling

**Fonts** are part of the ad shell and are bundled by Parcel via the static files plugin. Because Parcel copies static assets independently per build target, duplicate font directories can appear in the output — the build scripts remove these post-build.

**Dynamic images** are injected by Google Studio at runtime via its feed system. They are referenced in the code as string values rather than imported assets, so Parcel does not attempt to bundle them. This avoids build errors and correctly defers resolution to Studio.

---

## Running Locally

Prerequisites: Node.js, npm.

```bash
# Install dependencies (run inside each size directory)
cd 300x250
npm install

# Start dev server (development environment)
npm run start:dev

# Start dev server (example environment)
npm run start:example

# Build for a specific environment
npm run build:development
npm run build:example
npm run build:live
```

Each size runs on port `1241` by default. If running multiple sizes simultaneously, the port will need to be changed per size in `package.json`.

---

## Status and Future Improvements

The project is production-ready in its current form. Known areas for future development:

- **Multi-size builds** — each size is currently a separate Parcel project with its own `node_modules` and build pipeline. Exploring a single shared configuration that builds all sizes from one entry point would reduce duplication and simplify dependency management.
- **Platform portability** — the system is built around Google Studio's `Enabler` API and feed structure. Adapting it to other dynamic ad platforms (e.g. Flashtalking, Sizmek) would require abstracting the environment and click-handling layers.
- **Shared source** — scripts and styles are currently duplicated across size directories. A monorepo or shared package approach could centralise common modules.
