FEATURES

Simple and intuitive navigation powered by Expo Router

Clean, modular components

Preview screen with context-aware actions

Fully typed codebase using TypeScript

Runs on iOS, Android, and Web


PROJECT LAYOUT (Simplified)
app/ → Screens and navigation
components/ → Reusable UI
assets/ → Images, icons, fonts
pdf/
  sections/        ← document sections (what shows up in the PDF)
  utils/           ← math / helpers / builders
  buildPdf.ts      ← orchestration
  types.ts         ← shared types


SCRIPTS
npm start → Start Expo
npm run gitpush → Commit + push changes
npm run build → Production build

GIT WORKFLOW
git add .
git commit -m "message"
git push

BUILDING FOR PRODUCTION
Classic build:
npx expo prebuild
npx expo run:android
npx expo run:ios


High-level PDF Struture, using pdfmake:
PDF
├─ Cover Page (optional, later)
├─ Screen / Hardware (Store: screen)
├─ Control / Processing (Store: control)
├─ Cabling / Infrastructure (Store: cables)
├─ Drawings – Screen Layout (Grid view)
├─ Drawings – Power Linking
├─ Drawings – Signal Linking
├─ Drawings – System Topology
├─ Bill of Materials (BOM)
└─ Footer (page numbers, export date)
