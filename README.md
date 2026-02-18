# Procascii

Deterministic procedural art web app built with Vite + React + TypeScript + three.js.

## Pipeline

Implemented pipeline order in code:

1. `style = deriveStyle(params, rng)` (`src/core/style.ts`)
2. `sceneSpec = generateScene(params, rng, style)` (`src/core/generateScene.ts`)
3. WebGL render to base canvas (`src/render/three/ThreeScene.tsx`)
4. Optional deterministic post layers to post canvas (`src/render/post/layers.ts`)
5. ASCII sampling from base or post via toggle (`src/render/ascii/ascii.ts`)
6. PNG export from base or post via toggle (`src/App.tsx`)

## Determinism

- Seeded RNG: `mulberry32` in `src/core/rng.ts`.
- Params are JSON serializable and contain all generation/post/ascii controls in `src/core/params.ts`.
- Save/Load Params JSON available from UI controls.

## Primitive system

Registry pattern in `src/core/generateScene.ts` with modules in `src/primitives/*`:

- `ribbons` (CatmullRom + TubeGeometry)
- `steps` (stacked slabs)
- `fieldLines` (vector field linework)
- `blobs` scaffold slot

Each primitive exposes:

- `generate(params, rng, style)`
- `buildThreeObjects(spec, style)`

## Palette + style

Procedural palette generation in `src/core/palette.ts`:

- background
- 3-8 accents
- gradient stops

Controlled by hue mode, contrast, brightness, saturation, and seed offset. No hardcoded curated palettes.

## Post layers

Toggleable deterministic stack:

- framing/vignette
- tiling/panels
- block swaps
- warp

All live in `src/render/post/layers/*` and orchestrated in `src/render/post/layers.ts`.

## ASCII + ANSI

`canvasToAscii(canvas, options)` supports:

- monochrome luminance mapping
- ANSI color (`16color` or `xterm256`)
- efficient color run grouping
- copy/download txt in UI

## Controls

`src/ui/Controls.tsx` includes minimum controls for:

- seed/regenerate
- render mode (Solid/ASCII)
- primitive mix
- palette + post toggles
- ascii controls
- source toggles for ascii/png
- export/copy/save/load actions

## Tests

Vitest coverage:

- RNG determinism
- palette determinism/bounds
- ASCII mapping stability

Run:

```bash
npm test
```

## Dev

```bash
npm install
npm run dev
```
