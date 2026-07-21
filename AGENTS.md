# Agent Instructions

## Project mission

Build Asobi, a voice-first educational application that transforms each child's drawing into a personalized Mathematics or English learning experience for ages 4–12.

The guiding idea is: instead of giving every child the same worksheet, Asobi turns each child's imagination into their own personalized curriculum.

## Product principles

- Center the child's drawing in every lesson rather than adding superficial references.
- Make the primary experience usable through voice and simple visual interaction.
- Keep content, vocabulary, pacing, and difficulty age appropriate.
- Respond to mistakes with encouragement, hints, and adaptation.
- Keep lessons bounded, explainable, and educationally focused.
- Collect and retain the minimum child data necessary.
- Design clear fallbacks for unclear images, silence, transcription errors, and provider failures.
- Optimize for one reliable hackathon vertical slice before expanding scope.

## Required reading

Before every major task, Codex must read:

1. `AGENTS.md`
2. `README.md`
3. `docs/PRODUCT_SPEC.md`
4. `docs/ARCHITECTURE.md`
5. `docs/ROADMAP.md`
6. `docs/TASKS.md`

Codex must also inspect current configuration, relevant source files, and git status before editing. If requirements conflict, stop and surface the conflict rather than guessing.

## Coding conventions

- Use strict TypeScript; avoid `any` and unsafe type assertions.
- Validate all external, uploaded, persisted, and model-generated data at runtime.
- Prefer small, single-purpose modules with explicit inputs and outputs.
- Prefer named exports except where Next.js requires a default export.
- Keep server-only code clearly separated and mark it with `server-only` where appropriate.
- Prefer Server Components; introduce Client Components only for browser APIs, state, events, or hooks.
- Use the configured path alias consistently once the toolchain defines it.
- Keep prompts and schemas out of UI components and route handlers.
- Add tests alongside meaningful domain logic and integration boundaries.
- Never commit secrets, generated build output, local databases, recordings, or child data.
- Use accessible semantics and support non-audio fallbacks where the product specification requires them.

## Folder responsibilities

- `app/`: App Router routes, layouts, route handlers, metadata, and route-level boundaries.
- `components/`: reusable UI and interaction components with minimal domain logic.
- `lib/`: domain services, validation, persistence, orchestration, and shared utilities.
- `lib/drawing/`: browser-safe drawing constraints, validation, and image-preparation utilities.
- `lib/openai/`: server-only OpenAI client and provider adapters.
- `lib/prompts/`: versioned prompts, structured-output schemas, and age/subject constraints.
- `types/`: shared domain types and public contracts; derive from runtime schemas when possible.
- `hooks/`: reusable client-only React hooks.
- `public/`: static public assets with no credentials or private user content.
- `docs/`: product, architecture, roadmap, and execution documentation.

## Architecture rules

- Never expose OpenAI or Supabase service credentials to the browser.
- Keep provider calls behind narrow server-side adapters.
- Keep business and educational rules independent from React and provider SDKs.
- Treat AI output and speech transcripts as untrusted data.
- Require structured, runtime-validated outputs for lesson generation and adaptation.
- Centralize model names, limits, prompt versions, and provider defaults.
- Persist approved domain records, not incidental component state.
- Apply Supabase Row Level Security and least privilege before using real user data.
- Bound image sizes, audio duration, output length, and lesson turns.
- Do not log raw drawings, audio, transcripts, or identifying child data by default.
- Add explicit timeouts and child-friendly failure handling around external services.
- Keep public API contracts stable and documented.
- Keep `PreparedDrawing` image data browser-local until an explicitly approved server boundary is implemented.
- Treat `asobi:journey:v1` session state as temporary route context, never as permanent learning memory.
- Phase 5 permits only the documented `/api/drawings/analyze` server boundary; keep lesson, voice, persistence, and authentication outside it.
- Phase 6 lesson planning accepts validated `DrawingAnalysis`, never the original image, and stores only temporary `asobi:lesson:v1` session state.

## Change control

Codex must not redesign the architecture, change the product mission, expand MVP scope, or replace the planned technology stack unless explicitly instructed by the user.

When a requested change would cross an architecture boundary, Codex must explain the impact and obtain direction before proceeding. Update the relevant documentation whenever an explicitly approved architectural decision changes.
