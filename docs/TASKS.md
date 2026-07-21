# Task Checklists

These checklists intentionally start empty. Add scoped, reviewable tasks only when a phase begins; do not use this file to silently expand MVP scope.

## Phase 1 — Repository foundation

- [ ]

## Phase 2 — Application toolchain

Status: complete.

- [x] Initialize Next.js 15 with the App Router and React 19.
- [x] Enable strict TypeScript and the project path alias.
- [x] Configure Tailwind CSS 4 and PostCSS.
- [x] Configure ESLint and Prettier.
- [x] Pin Node.js 22 LTS and npm 11 requirements.
- [x] Commit npm dependency metadata and a reproducible lockfile.
- [x] Add Vitest and a minimal automated smoke test.
- [x] Add the minimal Asobi application shell.
- [x] Pass install, lint, type-check, formatting, test, audit, and production-build validation.
- [x] Confirm the development homepage returns HTTP 200 without runtime errors.

## Phase 3 — Application shell and user flow

Status: complete.

- [x] Create landing, age selection, drawing, lesson, and progress routes.
- [x] Add a shared header, footer, container, button, card, section, and page header.
- [x] Store age selection in temporary React state and navigate to the drawing route.
- [x] Add static drawing, upload, lesson, voice, and progress placeholders only.
- [x] Apply a warm, playful, responsive Tailwind presentation.
- [x] Add semantic headings, keyboard-accessible controls, and visible focus states.
- [x] Pass lint, type checking, formatting, tests, and production build.
- [x] Verify all routes and navigation at mobile and desktop widths.
- [x] Confirm the development server and browser console are error-free.

## Phase 4 — Drawing input vertical slice

Status: complete.

- [x] Persist a validated age group for the current browser session.
- [x] Handle missing and invalid journey state safely on `/draw`.
- [x] Implement responsive pointer-event canvas drawing.
- [x] Add pencil, eraser, colors, stroke sizes, undo, and clear controls.
- [x] Validate and decode PNG, JPEG, and WebP uploads up to 8 MB.
- [x] Maintain exactly one active canvas or upload drawing source.
- [x] Preview, replace, and clear the current drawing.
- [x] Produce and validate one normalized `PreparedDrawing` contract.
- [x] Show mock processing and metadata without external requests or data URL output.
- [x] Add meaningful pure-logic tests.
- [x] Pass lint, type checking, formatting, tests, build, audit, and live browser validation.

## Phase 5 — Personalized lesson generation

- [ ]

## Phase 6 — Voice interaction and adaptation

- [ ]

## Phase 7 — Progress persistence

- [ ]

## Phase 8 — Safety, quality, and observability

- [ ]

## Phase 9 — Deployment and hackathon demo

- [ ]
