# Product Specification

## Vision

Asobi transforms a child's own drawing into a personalized learning experience. Rather than presenting a fixed worksheet, it uses the child's imagination as the context for an adaptive, spoken Mathematics or English lesson.

The product is designed for children ages 4–12 and should feel playful, encouraging, safe, and easy to use without requiring fluent reading or typing.

## Target users

- Primary user: a child ages 4–12 creating a drawing and completing a lesson.
- Supporting user: a parent, guardian, teacher, or hackathon evaluator helping with setup and reviewing progress.

## Core user journey

1. A child starts a new activity and provides their age or learning level.
2. The child draws on the canvas or uploads a drawing.
3. The child chooses Mathematics or English, or accepts an appropriate suggestion.
4. Asobi analyzes the drawing and identifies safe, age-appropriate learning opportunities.
5. Asobi introduces a short lesson using speech and visual context from the drawing.
6. The child answers aloud.
7. Asobi transcribes and evaluates the response, gives supportive feedback, and adapts the next prompt.
8. Asobi completes the activity with a concise celebration and saves learning progress.
9. A supporting adult can review a simple summary of the activity and demonstrated skills.

## MVP scope

### Included

- Drawing canvas and image upload as lesson inputs.
- Age or learning-level selection for ages 4–12.
- Mathematics and English lesson modes.
- Vision-based interpretation of a drawing.
- Generation of a short, structured, age-appropriate lesson.
- Spoken lesson prompts and spoken child responses.
- Adaptive feedback over a bounded number of turns.
- Persistence of activity metadata, lesson progress, and outcomes.
- Basic safety controls, input validation, and graceful failure states.
- A demo-ready end-to-end experience deployed on Vercel.

### Excluded from the hackathon MVP

- A full curriculum-management platform.
- Grading, standardized assessment, or diagnostic claims.
- Social features or child-to-child communication.
- Public sharing of drawings or voice recordings.
- Teacher classroom administration.
- Native mobile applications.
- Broad subject coverage beyond Mathematics and English.
- Long-term memory beyond explicitly designed progress records.

## Product principles

- Imagination first: the child's artwork should materially shape the lesson.
- Voice first: core participation should not depend on typing.
- Age appropriate: vocabulary, pacing, difficulty, and feedback must fit the child's level.
- Supportive, not punitive: mistakes produce encouragement and useful hints.
- Short and focused: activities should have a clear goal and bounded duration.
- Privacy conscious: collect the minimum data needed and avoid unnecessary retention of children's audio or images.
- Adult transparent: generated learning goals and saved progress should be explainable.
- Resilient: the experience should recover clearly from unclear drawings, silence, transcription errors, or model failures.

## MVP success criteria

- A child can complete the full drawing-to-lesson journey without typing.
- The generated lesson clearly references recognizable elements of the submitted drawing.
- Questions and feedback differ appropriately by age and subject.
- At least one spoken response changes the next instructional step.
- Progress is saved and can be retrieved reliably.
- The deployed demo completes within hackathon time and service constraints.
- Secrets and privileged data access remain server-side.

## Hackathon goals

- Demonstrate a memorable use of the configured OpenAI vision model and reasoning grounded in a child's creation.
- Show a coherent multimodal loop: image understanding, lesson generation, speech output, speech input, and adaptation.
- Deliver a polished, reliable vertical slice rather than broad feature coverage.
- Make the educational value legible to judges through a concise demo and observable adaptation.

## Open product decisions for Phase 2

- Exact age bands and lesson-length limits.
- Whether subject selection is explicit, suggested, or both.
- Authentication approach for the demo.
- Retention policy for drawings, transcripts, and generated audio.
- Adult progress-summary scope.
- Supported browsers and fallback behavior when microphone access is unavailable.
