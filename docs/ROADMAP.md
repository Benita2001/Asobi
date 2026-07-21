# Roadmap

## Phase 1 — Repository foundation

Establish product, architecture, agent, environment, and delivery documentation. Create the empty module boundaries without implementing features.

Exit criteria: the repository has an agreed direction and an explicit Phase 2 starting point.

## Phase 2 — Application toolchain

Initialize Next.js 15, TypeScript, Tailwind CSS, linting, formatting, and tests. Select the package manager and record required technical decisions.

Status: complete.

Exit criteria: a clean scaffold passes format, lint, type checking, tests, and production build with no product UI.

## Phase 3 — Application shell and user flow

Create the complete responsive route structure, reusable presentation components, temporary age selection, and static placeholders for the intended experience.

Status: complete.

Exit criteria: every planned shell route is accessible, navigable, responsive, and free of runtime or browser console errors without implementing product functionality.

## Phase 4 — Drawing input vertical slice

Implement the bounded browser-local drawing/upload experience, session journey state, normalized drawing contract, and validation failure states.

Status: complete.

Exit criteria: a drawing can move safely from browser input to a validated, mocked analysis handoff without an external request.

## Phase 5 — Personalized lesson generation

Integrate GPT-5.6 vision and structured lesson generation for Mathematics and English, with age bands, prompt versioning, safety controls, and test fixtures.

Exit criteria: representative drawings consistently produce valid, drawing-grounded lesson plans.

## Phase 6 — Voice interaction and adaptation

Add text-to-speech, microphone capture, speech-to-text, answer evaluation, and bounded adaptive lesson turns with accessible fallbacks.

Exit criteria: a child can complete a short lesson without typing and receive an adaptive response.

## Phase 7 — Progress persistence

Implement the approved Supabase schema, Row Level Security, session recovery, and a minimal adult-readable progress summary.

Exit criteria: authorized progress survives refresh and cannot be accessed across users.

## Phase 8 — Safety, quality, and observability

Harden validation, privacy behavior, rate and cost limits, logging, accessibility, error recovery, and automated test coverage.

Exit criteria: known failure paths are safe, understandable, measurable, and demo-ready.

## Phase 9 — Deployment and hackathon demo

Configure Vercel environments, run production validation, rehearse the demo path, prepare fallback fixtures, and document the final presentation.

Exit criteria: the deployed vertical slice is reliable and the product value can be demonstrated succinctly.
