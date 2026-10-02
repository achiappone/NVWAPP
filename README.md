# NVWAPP — LED Video Wall Planner

A cross-platform (iOS, Android, Web) planning tool for LED video walls. Enter the screen,
processing and cabling, and the app works out the system, then generates a PDF with
drawings and a bill of materials that a crew can build from.

## What it does

- **Screen / hardware:** panel selection and wall dimensions, with derived pixel resolution
- **Control / processing:** media-server output count for HD or 4K output, based on the wall's pixel canvas
- **Cabling:** power and signal linking plans for the panel grid
- **Calculated preview:** grid views of the power runs, signal runs and overall system before export
- **PDF export:** the full system document, generated on-device with pdfmake

```
PDF
├─ Cover
├─ Screen / Hardware
├─ Control / Processing
├─ Cabling / Infrastructure
├─ Drawings: screen layout, power linking, signal linking, system topology
└─ Bill of Materials
```

## Architecture

| Path | Responsibility |
|---|---|
| `app/` | Screens and navigation (Expo Router) |
| `store/` | MobX-State-Tree root store split by domain (hardware, control, cables, UI); snapshots persisted to AsyncStorage |
| `domain/` | Pure calculation modules (power grid, signal grid, system grid, video source outputs), with no UI or store imports |
| `pdf/` | Document builder: `buildPdf.ts` orchestrates one module per section in `sections/` |

Keeping the calculations in `domain/` as plain functions keeps them testable and lets the
on-screen preview and the PDF drawings use the same code.

## Stack

React Native 0.81 · Expo 54 · Expo Router · TypeScript · MobX-State-Tree · pdfmake

## Run

```sh
npm install
npm start        # Expo dev server; press i / a / w for iOS, Android or web
```

Native builds:

```sh
npx expo prebuild
npx expo run:ios
npx expo run:android
```
