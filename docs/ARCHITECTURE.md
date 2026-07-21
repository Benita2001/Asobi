# Architecture

## Overview

Asobi is planned as a Next.js 15 App Router application deployed on Vercel. The browser owns drawing and voice interactions. Server-side application boundaries coordinate OpenAI and Supabase so privileged credentials never reach the client.

The Next.js application shell, technical toolchain, browser-local drawing input, and server-only Phase 5 vision analysis boundary are initialized. Lesson generation, voice, authentication, and persistence do not yet exist.

## System boundaries

- Browser client: drawing input, image upload, generated-audio playback, local Speech Recognition for answers, interaction state, and accessible feedback.
- Next.js application: pages, server components, route handlers or server actions, request validation, orchestration, and response shaping.
- OpenAI: drawing interpretation, structured lesson generation and adaptation, speech transcription, and speech synthesis.
- Supabase: identity if selected, relational progress data, and controlled object storage where required.
- Vercel: application hosting, server execution, preview deployments, and environment configuration.

## Module responsibilities

### `app/`

App Router entry points, layouts, route handlers, loading/error boundaries, and route-specific composition. Keep business logic out of route components.

### `components/`

Reusable presentation and interaction components. Client components should be introduced only when browser state, events, media APIs, or hooks require them.

### `lib/`

Framework-independent domain services, validation, Supabase access, lesson orchestration, safety utilities, and shared server helpers. Browser-safe and server-only modules must have explicit boundaries.

### `lib/drawing/`

Browser-safe drawing constants, file validation, data URL sizing, and preparation adapters. Visual components consume these utilities rather than duplicating image rules.

### `lib/openai/`

Server-only OpenAI client creation and narrowly scoped adapters for responses, vision inputs, transcription, and speech generation. Model identifiers and request defaults should be centralized. No API key may cross the server boundary.

### `lib/prompts/`

Versioned prompt templates, structured-output schemas, age-band guidance, subject constraints, and safety instructions. Prompts should be testable and separated from transport code.

### `lib/vision/`

Runtime schemas and request validation for drawing analysis. The server limit is an 8 MB decoded payload and 4096 pixels per dimension. Images are never written to disk or persisted.

### `types/`

Shared domain types and API contracts. Prefer deriving TypeScript types from runtime schemas when a payload crosses a trust boundary.

### `hooks/`

Reusable client-side React hooks for browser behavior such as microphone state or drawing interactions. Hooks must not own privileged service access.

`use-journey-state` owns the Phase 4 browser-session bridge. It reads and writes only the typed age group using the `asobi:journey:v1` session-storage key.

### `public/`

Static, non-sensitive assets only.

## Core data flow

1. The browser captures drawing data or validates an uploaded image.
2. The server receives a bounded, validated request and establishes the child-safe lesson context.
3. A server-side OpenAI adapter submits the drawing with age, subject, and structured-output constraints.
4. The application validates the model response before presenting lesson content.
5. The browser sends only concise validated lesson narration text to `POST /api/voice/narrate`; the server calls OpenAI Audio Speech and returns MP3 bytes.
6. The browser reuses that audio only for the current lesson session and records a bounded response with explicit microphone permission using local Speech Recognition.
7. The server transcribes audio, evaluates the answer in lesson context, and requests the next structured instructional step.
8. Supabase persists only the approved activity and progress fields.
9. The browser renders and speaks the next step or the completion summary.

## Phase 4 drawing-input flow

1. `/start` validates an `AgeGroup` and writes `{ ageGroup }` to `sessionStorage` under `asobi:journey:v1` before navigation.
2. `/draw` reads that state after client hydration. Missing or invalid state produces a friendly return path to `/start`.
3. Pointer strokes are retained as in-memory stroke records and rendered into a white 1200 × 800 native canvas. Undo redraws the retained strokes; clear removes them.
4. Uploads are restricted to PNG, JPEG, or WebP and 8 MB. The browser temporarily creates an object URL to confirm the file decodes, converts the file to a data URL, reads dimensions, and revokes the object URL.
5. Canvas and upload adapters produce one `PreparedDrawing`. Selecting one source clears the competing submission state.
6. The mock handoff validates the contract and displays metadata without logging or displaying the data URL. No network request occurs.

## Phase 5 vision-analysis flow

1. The draw client submits `{ ageGroup, drawing }` to `POST /api/drawings/analyze`.
2. The route validates the request, data URL, MIME signature, decoded size, and dimensions.
3. A server-only OpenAI adapter sends the image and age-aware safety prompt through `responses.parse` with Zod structured output.
4. The route returns only validated `DrawingAnalysis` data or a safe error envelope.
5. The client renders an observation, objects, colors, shapes, and up to three learning directions. No lesson content is generated.

## Phase 6 lesson-planning flow

1. The draw client submits `{ ageGroup, drawingAnalysis, subjectPreference }` to `POST /api/lessons/plan`; the original image is never sent.
2. The route validates the analysis and preference, then calls the server-only Responses API planner.
3. The client stores only the validated lesson, age, observation, and timestamp under `asobi:lesson:v1` for up to two hours, then navigates to `/lesson`.
4. `/lesson` validates temporary state and performs local answer comparison only. It does not call GPT or store progress.

## Phase 8 learning-memory flow

1. Age selection, drawing analysis, and lesson completion update the versioned `asobi:memory:v1` localStorage record.
2. Only bounded educational summaries are retained: age group, subject usage, drawing themes, lesson summaries, concept attempts/correct counts, streak, and preferred interaction.
3. Before lesson planning, the client sends a compact memory summary alongside validated `DrawingAnalysis`; the original image, transcripts, raw answers, and provider responses are never included.
4. Corrupt or unknown-version storage safely resets to an empty memory record. The storage boundary is isolated in `lib/memory` for future replacement.

### Normalized drawing contract

```ts
interface PreparedDrawing {
  source: "canvas" | "upload";
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  dataUrl: string;
  width: number;
  height: number;
  originalFileName?: string;
  sizeBytes?: number;
}
```

Canvas drawings export as PNG. Uploads retain their validated MIME type. The data URL is browser-local Phase 4 input and must not be logged or persisted as learning memory.

## Journey state versus learning memory

Session journey state is short-lived UI context used to carry the selected age between routes and refreshes in one browser tab. It is not authoritative user data, a child profile, progress history, or long-term memory. Future learning persistence must use an explicitly designed, access-controlled server data model.

## Data model direction

The exact schema is a Phase 2 design task. Likely entities are profiles or learners, activities, drawings or asset references, lesson sessions, lesson turns, and progress summaries. Raw media retention must be an explicit decision, not an accidental side effect.

## Architecture rules

- Keep OpenAI and Supabase privileged credentials in server-only modules.
- Validate file type, size, request shape, and all model-produced structured data at runtime.
- Treat model output and transcriptions as untrusted input.
- Use explicit schemas for AI outputs and API boundaries.
- Keep prompts versioned and observable without logging children's sensitive content.
- Separate domain decisions from provider SDK calls so integrations can be tested independently.
- Prefer Server Components; use Client Components only for genuine browser interactivity.
- Avoid placing persistent lesson state solely in browser memory.
- Apply least-privilege Supabase Row Level Security before storing user data.
- Define timeouts, retries, idempotency, and child-friendly fallback states for external calls.
- Minimize collection and retention of child data; never expose secrets in `NEXT_PUBLIC_*` variables.

## Operational concerns

- Observability should record latency, failure category, token or audio usage, prompt version, and anonymous session identifiers without raw child content by default.
- Cost controls should bound image dimensions, audio duration, model turns, and output length.
- Rate limits should exist at public server boundaries.
- Generated lessons need safety checks appropriate to children and a constrained educational scope.
- Accessibility should cover keyboard alternatives, captions or visible transcripts, audio controls, and clear permission/error states.

## Testing strategy

- Unit tests for schemas, age-band rules, prompt construction, and domain decisions.
- Contract tests for provider adapters using fixtures and mocked network calls.
- Integration tests for persistence and server boundaries.
- End-to-end tests for the primary drawing-to-lesson flow, including denied microphone permission and provider failure.
- Manual checks with representative ages, subjects, drawing complexity, accents, and noisy audio.

## Phase 8 narration flow

1. The lesson client deterministically builds concise narration from the title, introduction, activity prompt, and multiple-choice labels only.
2. A user action requests `POST /api/voice/narrate`; the server validates bounded text and resolves `OPENAI_TTS_MODEL` and `OPENAI_TTS_VOICE` from server-only configuration.
3. OpenAI returns MP3 bytes, held in a browser object URL for the current lesson page only. Replay reuses that URL and Stop resets playback.
4. Audio is never written to storage, uploaded elsewhere, or persisted. The interface discloses AI-generated narration. Speech Recognition remains browser-based and microphone audio is never sent to OpenAI.

## Phase 9 scene flow

1. The lesson page derives one validated `SceneSpecification` from the current `LessonPlan`; the planner decides the educational visual and the image provider only renders it.
2. The browser sends the specification to `POST /api/scenes/generate`; the server calls the official OpenAI Images API with `OPENAI_IMAGE_MODEL`.
3. The response is returned as PNG bytes and held in a page-session object URL. It is generated once per lesson, includes planner-derived alt text, and is revoked when the page unmounts.
4. Image failures show a friendly fallback while leaving the lesson controls usable. No image is written to disk, local storage, session storage, Supabase, or a database.
