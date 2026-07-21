# Asobi

Asobi is a voice-first educational application for children ages 4–12. A child draws on a canvas or uploads a drawing, and Asobi turns that artwork into a personalized, age-appropriate Mathematics or English learning experience.

> Instead of giving every child the same worksheet, Asobi turns each child's imagination into their own personalized curriculum.

This repository contains the technical foundation, a polished application shell, and a local drawing-input experience for the OpenAI Build Week hackathon. AI and backend features have not yet been implemented.

## Planned stack

- Next.js 15 with the App Router
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI Responses API with GPT-5.6 and vision input
- OpenAI text-to-speech and speech-to-text
- Vercel

## Prerequisites

Install:

- Node.js 22 LTS (see `.nvmrc`)
- npm 11
- A Supabase project
- An OpenAI API project and key
- A Vercel account for deployment

## Setup

To set up the project:

1. Run `nvm use` to select Node.js 22.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` when service integration begins.
4. Add development credentials to `.env.local`; no credentials are needed for the foundation shell.
5. Run `npm run dev` and open `http://localhost:3000`.

Never commit `.env.local` or credentials.

## Local development

Available scripts:

- `dev` — start the Next.js development server
- `build` — create a production build
- `start` — run the production build locally
- `lint` — run the configured linter
- `typecheck` — run TypeScript without emitting files
- `format` / `format:check` — write or verify formatting
- `test` — run the Vitest suite once

Before opening a pull request, run `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm test`, and `npm run build`.

## Local drawing journey

- The chosen age group is stored under `asobi:journey:v1` in browser `sessionStorage` and lasts only for the current tab session.
- The drawing canvas and upload are prepared in the browser, then sent only to the server analysis boundary.
- Accepted uploads are PNG, JPEG, and WebP files up to 8 MB.
- Clicking **Discover My Drawing** submits a validated image to `POST /api/drawings/analyze`. Images are not persisted and lesson generation is not implemented yet.
- Session journey state is temporary interaction context, not permanent learning progress or memory.

## Deployment

The intended deployment target is Vercel:

1. Import the repository into Vercel.
2. Configure all required server-only and public environment variables.
3. Connect the production Supabase project.
4. run lint, type checking, tests, and a production build before promotion.
5. Verify microphone permissions, audio playback, drawing upload limits, and server-side secret handling in the deployed environment.

Preview and production environments should use separate Supabase projects or isolated schemas and storage policies where practical.

## Documentation

- [Product specification](docs/PRODUCT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Task checklists](docs/TASKS.md)
- [Technical decisions](docs/DECISIONS.md)
- [Agent instructions](AGENTS.md)

## Current status

Phase 5 drawing analysis is implemented behind a server-only OpenAI Responses API boundary. The draw page returns a validated child-friendly observation; no lesson, voice, authentication, database, or permanent memory exists.
