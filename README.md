# Procascii

Deterministic procedural art web app built with Vite + React + TypeScript + three.js.

## Pipeline

1. `style = deriveStyle(params, rng)` (`src/core/style.ts`)
2. `field = createFieldContext(params)` (`src/core/field.ts`)
3. `sceneSpec = generateScene(params, rng, style)` (`src/core/generateScene.ts`)
4. WebGL render to base canvas (`src/render/three/ThreeScene.tsx`)
5. Optional deterministic post layers (`src/render/post/layers.ts`)
6. ASCII sampling from base/post (`src/render/ascii/ascii.ts`)

## Shared procedural field

`src/core/noise.ts` and `src/core/field.ts` provide seeded value noise + fBm, domain warping, scalar sampling, and a vector field.
All primitives use this shared field:

- `fieldLines`: streamlines through `sampleVector`
- `ribbons`: advection paths through same vector field
- `steps`: noise-driven heightfield with terracing
- `blobs`: noise-positioned instanced sphere blobs

## Parameter influence map

- `seed`, `paletteSeedOffset` → field + palette seeding
- `hueMode`, `contrast`, `brightnessBias`, `saturationBias`, `backgroundBias` → palette generation (`src/core/palette.ts`)
- `materialModel`, `roughness`, `metalness`, `colorApplicationMode` → primitive materials/colors (`src/primitives/materials.ts`)
- `terraceStrength`, `stepCount`, `stepHeight`, `stepDepth`, `taper`, `spacing` → step/ribbon geometry (`src/primitives/steps.ts`, `src/primitives/ribbons.ts`)
- `bendAmount`, `lineCount`, `stepsPerLine`, `fieldStrength`, `jitter`, `lineWidth` → field line + ribbon advection (`src/primitives/fieldLines.ts`, `src/primitives/ribbons.ts`)
- `density`, `scale`, `compositionMode`, `primitiveMix` → primitive counts, domain size/layout (`src/core/generateScene.ts`, `src/core/field.ts`)
- `renderMode` (UI label: Overlay), post controls, ASCII controls, export toggles → display/output pipeline (`src/App.tsx`, `src/ui/Controls.tsx`)

## Randomize

`randomizeParams` (`src/core/randomize.ts`) now randomizes a meaningful seeded subset:

- seed, primitive mix weights
- density / line counts / step counts
- field strength / jitter / terrace
- palette seed offset / background bias
- post layer toggles + strengths

## Tests

Vitest coverage includes:

- deterministic scene hashing for same params
- influence tests for key params (hash changes)
- randomize determinism with override seed

Run:

```bash
npm test -- --run
```
