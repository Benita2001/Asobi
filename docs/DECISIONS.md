# Technical Decisions

## TD-001 — Runtime and package manager

- Status: accepted
- Decision: use Node.js 22 LTS and npm 11, with npm's lockfile committed.
- Reason: Node.js 22 is an active LTS line suitable for local development and Vercel, while one package manager and lockfile keep installations reproducible.

## TD-002 — Styling toolchain

- Status: accepted
- Decision: use Tailwind CSS 4 through its PostCSS plugin.
- Reason: this is the stable Tailwind integration for the new toolchain and requires no speculative component or design-system dependency.

## TD-003 — Initial test runner

- Status: accepted
- Decision: use Vitest for unit and contract tests.
- Reason: Vitest has fast TypeScript support and is sufficient for the foundation smoke test. Browser end-to-end tooling should be selected only when a product flow requires it.

## TD-004 — Code-quality configuration

- Status: accepted
- Decision: use ESLint's flat configuration with Next.js Core Web Vitals and TypeScript rules, plus Prettier and its Tailwind plugin.
- Reason: this provides framework-aware static analysis and deterministic formatting with a small configuration surface.

## TD-005 — Next.js PostCSS security override

- Status: accepted
- Decision: override Next.js 15's internal PostCSS dependency with PostCSS 8.5.20.
- Reason: Next.js 15.5.20 pins PostCSS 8.4.31, which is covered by a moderate CSS-stringification advisory. The override stays within the same major version and produces a zero-vulnerability npm audit without changing the required Next.js major version.

## TD-006 — Native canvas and session-local journey state

- Status: accepted
- Decision: implement drawing with the native Canvas and Pointer Events APIs, and store only `{ ageGroup }` in `sessionStorage` under `asobi:journey:v1`.
- Reason: the Phase 4 feature set does not require a drawing or global-state dependency. Pointer Events cover mouse, pen, and touch through one input model, while session storage preserves route context without creating permanent child memory.

## TD-007 — Browser-local normalized drawing payload

- Status: accepted
- Decision: normalize canvas and validated upload inputs into a `PreparedDrawing` containing a data URL, MIME type, dimensions, source, and optional original-file metadata.
- Reason: a single typed contract isolates image preparation from visual components and gives Phase 5 a consistent input. Data URLs avoid external storage in Phase 4 and must not be logged or persisted.

## TD-008 — Server-only vision analysis boundary

- Status: accepted
- Decision: use the official OpenAI JavaScript SDK Responses API with `responses.parse`, `OPENAI_MODEL`, and a Zod structured-output schema behind `POST /api/drawings/analyze`.
- Reason: this keeps credentials server-only, validates model output at runtime, and establishes a stable analysis contract without lesson functionality.

## TD-009 — Explicit live-only AI mode

- Status: accepted
- Decision: document `ASOBI_AI_MODE=live`; no fixture mode is implemented.
- Reason: tests mock the provider seam, while production fails clearly when credentials are missing rather than silently presenting fake analysis.
