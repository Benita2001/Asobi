# Asobi

> Turn a child’s imagination into a personalized learning adventure.

[Live Demo](https://asobi-beta.vercel.app) · [GitHub Repository](https://github.com/Benita2001/Asobi)

Asobi is an AI-powered learning platform that turns children’s drawings into personalized educational experiences.

A child can draw a house, dragon, rocket, animal, imaginary character, or almost anything else. Asobi studies the drawing, identifies the important visual details, creates an age-appropriate lesson around it, generates a new educational illustration, narrates the lesson, and asks an interactive question.

Instead of starting with a fixed curriculum and asking every child to follow the same path, Asobi starts with something the child already cares about their own imagination.

A dragon can become a counting activity.

A rocket can become a language or space lesson.

A house can become a lesson about shapes, colors, multiplication, or vocabulary.

Every drawing creates a different learning experience.

---

## Table of Contents

- [The Idea](#the-idea)
- [The Problem](#the-problem)
- [How Asobi Works](#how-asobi-works)
- [Core Features](#core-features)
- [How GPT-5.6 Powers Asobi](#how-gpt-56-powers-asobi)
- [OpenAI Models Used](#openai-models-used)
- [AI Architecture](#ai-architecture)
- [How Codex Was Used](#how-codex-was-used)
- [My Role in the Development Process](#my-role-in-the-development-process)
- [Technical Architecture](#technical-architecture)
- [Technology Stack](#technology-stack)
- [Application Flow](#application-flow)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Structured AI Outputs](#structured-ai-outputs)
- [Session and State Management](#session-and-state-management)
- [Privacy and Safety Considerations](#privacy-and-safety-considerations)
- [Running Asobi Locally](#running-asobi-locally)
- [Environment Variables](#environment-variables)
- [Validation and Testing](#validation-and-testing)
- [Challenges](#challenges)
- [What I Learned](#what-i-learned)
- [Current Limitations](#current-limitations)
- [Future Development](#future-development)
- [Acknowledgements](#acknowledgements)

---

## The Idea

Most learning platforms begin with a lesson that has already been prepared.

The child is then expected to adapt to the lesson.

Asobi reverses that process.

It begins with the child’s drawing and uses that drawing as the starting point for the lesson.

The idea came from a simple observation: children often imagine before they explain. A drawing may look simple to an adult, but to the child it can represent an entire world, character, or story.

Asobi tries to understand that creative starting point and turn it into a focused learning experience.

The goal is not to replace teachers, parents, or traditional education. The goal is to make the first step into learning feel more personal, playful, and connected to the child.

---

## The Problem

Many educational applications provide the same content to every learner.

They may change the difficulty level, but the lesson itself often remains disconnected from what the child is personally interested in.

This can create several problems:

- Children lose interest quickly.
- Learning activities can feel repetitive.
- Younger learners may struggle with long written instructions.
- Creative activities and academic activities are treated as separate experiences.
- Personalized learning often requires a large amount of manually prepared content.

Asobi explores a different approach.

Instead of treating drawing as a break from learning, Asobi makes the drawing the foundation of the learning experience.

---

## How Asobi Works

```text
Child creates or uploads a drawing
              │
              ▼
Drawing is prepared in the browser
              │
              ▼
GPT-5.6 analyzes the drawing
              │
              ▼
Structured drawing information is validated
              │
              ▼
GPT-5.6 creates a focused lesson plan
              │
              ▼
GPT-5.6 prepares an educational scene specification
              │
              ▼
GPT Image 1 renders the educational illustration
              │
              ▼
OpenAI Text-to-Speech narrates the lesson
              │
              ▼
The child answers an interactive question
              │
              ▼
Progress is recorded in the learning experience
```

The pipeline is intentionally divided into separate stages.

Asobi does not send one large prompt and ask a model to produce the entire experience at once. Each stage has a specific responsibility, a defined input, and a validated output.

This makes the system easier to test, debug, and improve.

---

## Core Features

### Drawing Canvas

Children can create a drawing directly inside the application.

The drawing workspace is designed to be simple and focused so that the child can begin creating without needing to understand complicated design tools.

### Drawing Upload

A child, parent, or teacher can also upload an existing image instead of drawing directly in the application.

### AI Drawing Understanding

Asobi analyzes more than the general subject of the drawing.

It attempts to identify details such as:

- The main subject
- Supporting objects
- Dominant colors
- Accessories
- Facial expressions
- Distinctive features
- Pose
- Composition
- Background elements
- General visual style

These details help the later stages remain connected to the child’s original artwork.

### Personalized Lesson Planning

The drawing analysis is transformed into a focused lesson.

Each lesson contains:

- A subject
- A title
- A child-friendly introduction
- One primary learning objective
- A short explanation
- An activity or question
- An expected answer
- Feedback guidance

The lesson planner is instructed to avoid combining unrelated educational objectives in the same lesson.

For example, it should not create a mathematics, grammar, science, and vocabulary lesson all at once.

The child receives one clear learning activity at a time.

### Educational Scene Generation

Asobi creates a new educational illustration based on both the child’s drawing and the learning objective.

The image is not meant to replace the original drawing. Both are shown in the lesson.

The original drawing gives the child a sense of ownership, while the generated illustration extends the idea into a clearer educational scene.

### Visual Identity Preservation

The scene planner attempts to preserve important features from the child’s artwork.

For example, if a child draws:

- A purple dragon
- Wearing a yellow hat
- With three stars in the background

the generated lesson scene should not become a completely unrelated generic dragon.

The important colors, accessories, objects, and visual details are passed through the AI pipeline.

### AI Narration

Lesson instructions can be narrated using OpenAI Text-to-Speech.

This makes the experience more accessible to children who:

- Are still learning to read
- Prefer audio instructions
- Need help with pronunciation
- Benefit from hearing instructions more than once

The interface includes controls for starting, replaying, and stopping narration.

### Speech Recognition Support

Where supported by the browser, Asobi can use browser speech-recognition capabilities for voice interaction.

The application handles unsupported browsers or unavailable microphone permissions gracefully rather than making voice input mandatory.

### Interactive Questions

Each lesson ends with a question or activity grounded in the drawing and the generated educational illustration.

The child can submit an answer and continue through the learning experience.

### Temporary Lesson Sessions

The active drawing and lesson are stored temporarily in the browser session.

This allows the child to move from drawing to lesson without creating an account.

Starting a new lesson clears only the current lesson session instead of removing unrelated learning progress.

---

# How GPT-5.6 Powers Asobi

GPT-5.6 is the main reasoning model behind Asobi.

It is not used as a general chatbot inside the application. Instead, it performs several specialized tasks throughout the learning pipeline.

The model used in the project is configured through:

```text
OPENAI_MODEL=gpt-5.6-luna
```

## 1. Understanding Children’s Drawings

The first role of GPT-5.6 is visual interpretation.

Children’s drawings can be difficult for traditional computer-vision systems because they do not always follow realistic proportions or recognizable visual rules.

A child may draw:

- A house with oversized windows
- A dragon with wheels
- A smiling sun inside a room
- A rocket shaped like an animal
- A character that only exists in their imagination

The model must interpret the drawing without forcing it into a narrow or overly literal category.

GPT-5.6 analyzes the image and produces structured information about what it believes the child created.

This includes the general meaning of the drawing as well as the visual details that make it unique.

## 2. Turning Visual Information Into Structured Data

Asobi does not rely only on a paragraph describing the picture.

GPT-5.6 returns structured data that can be validated before the application continues.

A simplified example looks like this:

```json
{
  "summary": "A house with two windows and flowers outside",
  "primarySubject": "house",
  "secondarySubjects": ["flowers", "sun"],
  "dominantColors": ["blue", "yellow", "green"],
  "distinctiveFeatures": [
    "two square windows",
    "large triangular roof",
    "three flowers"
  ],
  "composition": "The house is centered with flowers near the bottom"
}
```

Using structured data makes the next stages more reliable.

The lesson planner does not have to interpret an unpredictable paragraph. It receives clearly named fields that describe the drawing.

## 3. Preserving the Child’s Original Idea

One of the earliest problems during development was that later stages could lose the identity of the original drawing.

The system might correctly recognize a dragon, for example, but then generate a generic dragon that no longer resembled what the child made.

To improve this, GPT-5.6 was asked to extract a visual identity profile.

That profile can include:

- Primary subject
- Secondary objects
- Dominant colors
- Accessories
- Distinctive features
- Facial expression
- Pose
- Drawing style
- Composition
- Background elements

This visual identity is then passed into the scene-planning stage.

The result is a stronger connection between:

1. What the child drew
2. What the lesson teaches
3. What the generated illustration shows

## 4. Selecting an Educational Direction

A drawing can support many possible lessons.

A house could be used for:

- Counting windows
- Identifying shapes
- Learning household vocabulary
- Comparing sizes
- Practising multiplication
- Describing colors
- Writing a short story

GPT-5.6 evaluates the drawing together with the selected subject and learner context.

It then chooses one focused educational direction.

This is important because simply generating every possible learning idea would make the lesson confusing.

The model is guided to choose one primary skill and one clear learning objective.

## 5. Creating the Lesson Plan

Once the educational direction is selected, GPT-5.6 creates the lesson structure.

The lesson plan includes information such as:

- Subject
- Lesson title
- Short introduction
- Learning objective
- Explanation
- Activity instructions
- Question
- Expected answer
- Feedback language

The generated content is constrained to use child-friendly language.

The model is instructed to keep:

- Sentences short
- Vocabulary understandable
- Instructions direct
- Activities connected to visible objects
- Questions appropriate for the selected age level

## 6. Keeping Lessons Focused

Early lesson-generation attempts sometimes tried to teach too much at once.

A single drawing could become a lesson involving mathematics, reading, colors, science, and storytelling.

Although this sounded creative, it was not necessarily a good learning experience.

The prompt and validation pipeline were therefore updated so that GPT-5.6 focuses on:

- One primary skill
- One educational objective
- One main activity
- One clear question

This made the lessons easier to understand and improved the overall flow of the application.

## 7. Grounding Questions in the Drawing

GPT-5.6 is instructed to use information that is visible or reasonably derived from the drawing.

For example, if the lesson is about multiplication and the drawing contains two windows, the model might create a scenario where each window has three flower boxes.

The question then becomes connected to something the child can see:

> There are two windows. Each window has three flower boxes. How many flower boxes are there altogether?

This is more meaningful than generating an unrelated arithmetic question.

## 8. Planning the Educational Illustration

GPT-5.6 also acts as a scene planner before the image model is called.

It determines:

- Which objects must appear
- How many objects must be visible
- Where the objects should be placed
- Which details from the drawing must be preserved
- Which visual relationship supports the lesson
- What should not appear
- How the image should remain simple enough for a child to understand

This stage is important because image-generation models are better at rendering when they receive a clear and specific visual plan.

## 9. Separating Reasoning From Rendering

GPT-5.6 performs the reasoning.

GPT Image 1 performs the rendering.

This separation allows each model to do what it is best suited for.

GPT-5.6 decides:

- What the lesson should teach
- What the scene should contain
- Which details matter
- How the educational objects should be arranged

GPT Image 1 then turns that plan into an illustration.

This architecture produced more consistent results than asking the image model to invent the educational purpose on its own.

## 10. Improving Reliability With Validation

Every major GPT-5.6 output is validated before it is used.

The application checks that expected fields are present and correctly formatted.

This reduces problems such as:

- Missing questions
- Empty objectives
- Invalid arrays
- Unexpected response shapes
- Lessons with conflicting subjects
- Incomplete scene instructions

When a response does not match the required structure, the application can reject it safely instead of passing broken data to the next stage.

---

# OpenAI Models Used

## GPT-5.6 Luna

Used for:

- Drawing analysis
- Visual identity extraction
- Structured image understanding
- Educational subject selection
- Lesson planning
- Age-appropriate content generation
- Question generation
- Scene planning
- Educational composition decisions

Configuration:

```text
OPENAI_MODEL=gpt-5.6-luna
```

## GPT Image 1

Used for:

- Generating educational illustrations
- Extending the original drawing into a lesson scene
- Preserving important visual features
- Showing object groups and relationships needed for questions

Configuration:

```text
OPENAI_IMAGE_MODEL=gpt-image-1
```

## OpenAI Text-to-Speech

Used for:

- Narrating instructions
- Reading lesson explanations
- Replaying spoken content
- Improving accessibility for younger learners

Recommended configuration used during development:

```text
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=marin
```

---

# AI Architecture

```text
┌───────────────────────────────┐
│ Child creates or uploads art │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Drawing Preparation           │
│                               │
│ - Canvas export               │
│ - Image normalization         │
│ - Session handoff             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ GPT-5.6 Vision Analysis       │
│                               │
│ - Subject identification      │
│ - Visual identity extraction  │
│ - Composition understanding   │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Runtime Schema Validation     │
│                               │
│ - Required fields             │
│ - Type checks                 │
│ - Safe error handling         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ GPT-5.6 Lesson Planner        │
│                               │
│ - Select subject              │
│ - Choose one objective        │
│ - Generate instructions       │
│ - Create question             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ GPT-5.6 Scene Planner         │
│                               │
│ - Preserve drawing identity   │
│ - Plan educational objects    │
│ - Define composition          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ GPT Image 1                   │
│                               │
│ - Render lesson illustration  │
│ - Return generated image      │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ OpenAI Text-to-Speech         │
│                               │
│ - Narrate instructions        │
│ - Provide replay controls     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Interactive Lesson            │
│                               │
│ - Show original drawing       │
│ - Show generated scene        │
│ - Ask question                │
│ - Record response             │
└───────────────────────────────┘
```

---

# How Codex Was Used

Codex played a major role in the development of Asobi.

It was not used only to generate isolated snippets of code. I used Codex as an AI engineering collaborator throughout the project.

The development process followed a repeated loop:

```text
Define the product requirement
             │
             ▼
Break it into a focused implementation phase
             │
             ▼
Give Codex clear technical constraints
             │
             ▼
Codex inspects the existing repository
             │
             ▼
Codex implements the change
             │
             ▼
Run formatting, linting, tests, and builds
             │
             ▼
Review the result
             │
             ▼
Identify issues or improvements
             │
             ▼
Begin the next phase
```

## 1. Project Foundation

Codex helped establish the initial application foundation, including:

- Next.js project structure
- TypeScript configuration
- Tailwind CSS
- Shared components
- Navigation
- Drawing workflow
- Browser session state
- Application routes

The first goal was not to add AI immediately. The foundation was completed and validated before model integration began.

## 2. Incremental Development

The project was deliberately built in phases.

The major development phases included:

1. Application shell
2. Drawing canvas
3. Drawing upload
4. Drawing preparation
5. OpenAI Vision integration
6. Structured drawing analysis
7. Lesson planning
8. Voice narration
9. Learning-session management
10. Scene planning
11. Image generation
12. Visual identity preservation
13. User-experience improvements
14. Production deployment

Codex worked within each phase instead of attempting to generate the entire project in one step.

This reduced the risk of large, difficult-to-review changes.

## 3. Repository Inspection

Before implementing changes, Codex inspected the existing codebase.

It reviewed:

- Relevant components
- API routes
- Type definitions
- Validation schemas
- Environment configuration
- Session-storage utilities
- OpenAI integration boundaries
- Build scripts

This helped changes fit the existing architecture rather than introducing disconnected code.

## 4. Code Generation

Codex assisted in implementing:

- React components
- Next.js server routes
- TypeScript types
- Zod schemas
- Drawing utilities
- OpenAI API clients
- Prompt templates
- Lesson-session storage
- Image response handling
- Audio playback logic
- Error states
- Loading states
- Test coverage

The code was not accepted automatically.

Each stage was reviewed, tested, and refined before being committed.

## 5. Prompt Engineering

Codex was also used while developing the prompts that control the AI pipeline.

This included prompts for:

- Drawing interpretation
- Visual identity extraction
- Lesson planning
- Age-appropriate language
- Single-objective constraints
- Scene planning
- Image-generation instructions

The prompts evolved as problems were discovered during real testing.

For example, when lessons became too broad, the lesson-planning prompt was tightened.

When generated illustrations became generic, visual identity fields were added and given higher priority.

## 6. Structured Output Design

Codex helped implement the structured schemas used by GPT-5.6.

Instead of accepting free-form responses, the application defines clear data contracts for:

- Drawing analysis
- Lesson plans
- Scene specifications

Codex assisted with:

- TypeScript interfaces
- Runtime validators
- Required properties
- Array limits
- Error handling
- Backward compatibility

This was one of the most important parts of making the AI workflow dependable.

## 7. Debugging Structured Output Failures

During development, lesson generation initially failed because the model output did not match the required structured schema.

Codex helped:

- Inspect the response format
- Identify missing required arrays
- Correct schema definitions
- Preserve runtime validation
- Test multiple subject modes
- Confirm successful production responses

This allowed the project to keep strict validation without abandoning structured output.

## 8. Debugging Image Generation

The image-generation route initially failed because an unsupported request option was being sent to GPT Image 1.

The application was using:

```text
response_format: "b64_json"
```

The active model did not support that parameter in the way it was being called.

Codex helped identify the compatibility issue and update the integration while keeping:

- Base64 image extraction
- PNG responses
- Safe error categories
- Image caching
- User-friendly fallbacks

The route was then tested successfully with an `image/png` response.

## 9. Improving Visual Identity Preservation

Early generated scenes captured the general subject but did not always resemble the child’s drawing.

Codex helped extend the drawing-analysis schema with fields for:

- Primary subject
- Secondary subjects
- Dominant colors
- Accessories
- Distinctive features
- Facial expression
- Pose
- Art style
- Composition
- Background elements

The scene-planning prompt was then updated to prioritize these details.

This made the AI-generated lesson scene feel more connected to the original artwork.

## 10. Session-State Debugging

The lesson page originally had cases where the child’s original drawing was unavailable.

Codex helped trace the drawing data through:

```text
Drawing workspace
       │
       ▼
Prepared drawing
       │
       ▼
Temporary lesson session
       │
       ▼
Lesson page
```

The session flow was improved so that validated drawing data is stored with the active lesson.

Additional work included:

- Backward compatibility for older sessions
- Missing-drawing fallbacks
- Aspect-ratio preservation
- New-lesson recovery
- Clearing only the active lesson state

## 11. Next.js Runtime Debugging

During local development, the application encountered errors involving missing Next.js build files and stale chunks.

Examples included errors similar to:

```text
Cannot find module './331.js'
```

and:

```text
ENOENT: no such file or directory
.next/server/pages/_document.js
```

Codex investigated the development environment and found multiple stale Next.js servers running on different ports.

It then assisted with:

- Stopping old servers
- Removing stale `.next` output
- Rebuilding the application
- Starting one clean development server
- Confirming that no source-code changes were required

This avoided introducing unnecessary fixes for what was actually an environment problem.

## 12. Continuous Validation

Codex repeatedly ran the project’s quality checks after implementation phases.

The validation workflow included:

```bash
npm run format
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
```

Before the final GitHub synchronization:

- Formatting passed
- Linting passed
- Type checking passed
- Format checking passed
- All 42 tests passed
- The production build passed

## 13. Git and Repository Management

Codex helped prepare clean development checkpoints.

This included:

- Inspecting the working tree
- Reviewing diffs
- Confirming intended files
- Checking ignored files
- Preventing secrets from being committed
- Creating focused commits
- Synchronizing with GitHub
- Confirming that local `main` matched `origin/main`

The final lesson-session stabilization commit was:

```text
2933b1eaf7c52bcdd720e30b01e9843b5b1348eb
```

Commit message:

```text
fix: stabilize lesson experience and session handoff
```

## 14. Deployment Preparation

Codex also supported deployment readiness by checking:

- Production build compatibility
- Relative API routes
- Server-side OpenAI boundaries
- Environment-variable usage
- Absence of runtime localhost dependencies
- Absence of local filesystem dependencies
- Git cleanliness
- Vercel compatibility

The application was then deployed to Vercel.

## 15. How Codex Improved My Workflow

Codex changed the speed and structure of the development process.

It helped me move faster in several areas.

### Faster implementation

Codex reduced the time required to write repetitive application code, API routes, validation logic, and test scaffolding.

### Faster debugging

Instead of manually searching through the entire codebase, I could direct Codex to trace a specific problem across components, routes, schemas, and session state.

### Better checkpoints

Every phase had a defined purpose and validation process.

This made it easier to know what was working before introducing the next feature.

### More time for product decisions

Because Codex accelerated implementation, I could spend more time thinking about:

- Whether the lesson was genuinely useful
- Whether the drawing remained recognizable
- Whether the question was appropriate for a child
- Whether the narration improved the experience
- Whether the interface was understandable
- Whether the product solved the intended problem

### Safer experimentation

It became easier to try a new schema, prompt, UI flow, or architecture because Codex could help implement and test the change quickly.

### Better documentation

Codex produced implementation reports after major phases, which made it easier to track:

- What changed
- Why it changed
- Which files were affected
- Which tests were run
- Whether the build passed
- Whether a commit had been created

Codex did not replace product judgment.

It made the engineering loop faster, more structured, and easier to review.

---

# My Role in the Development Process

Although Codex assisted heavily with engineering, the project remained human-directed.

I was responsible for:

- Identifying the problem
- Defining the product vision
- Choosing the target users
- Designing the learning experience
- Deciding how drawings should influence lessons
- Selecting the AI architecture
- Dividing development into phases
- Reviewing generated code
- Testing the product
- Evaluating lesson quality
- Identifying weak outputs
- Refining prompts
- Approving commits
- Making deployment decisions
- Preparing the final submission

Several important product decisions came from reviewing actual outputs rather than accepting the first implementation.

For example:

- I rejected mock AI responses because the final project needed to use real OpenAI models.
- I decided that each lesson should teach one primary skill.
- I required the original drawing to remain visible.
- I required generated scenes to preserve the drawing’s visual identity.
- I chose to separate lesson planning from image rendering.
- I prioritized voice narration for younger learners.
- I reviewed and approved each major development checkpoint.

The finished project reflects a collaboration between human product direction and AI-assisted software engineering.

---

# Technical Architecture

Asobi is built as a Next.js application with client-side drawing tools and server-side OpenAI integrations.

```text
Browser
│
├── Drawing Canvas
├── Image Upload
├── Session Storage
├── Lesson Interface
├── Audio Playback
└── Optional Speech Recognition
        │
        ▼
Next.js Server Routes
│
├── Drawing Analysis
├── Lesson Generation
├── Scene Planning
├── Image Generation
└── Voice Narration
        │
        ▼
OpenAI APIs
│
├── GPT-5.6 Luna
├── GPT Image 1
└── OpenAI Text-to-Speech
```

## Client Responsibilities

The browser handles:

- Drawing interaction
- Image selection
- Temporary lesson state
- Displaying the original drawing
- Displaying the generated image
- Playing narration
- Capturing lesson answers
- Browser speech recognition where supported

## Server Responsibilities

Next.js server routes handle:

- OpenAI authentication
- Model requests
- Prompt construction
- Structured-output parsing
- Runtime validation
- Image response conversion
- Audio generation
- Safe provider-error handling

The OpenAI API key is never exposed to the browser.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- HTML5 Canvas

## AI

- OpenAI Responses API
- GPT-5.6 Luna
- GPT Image 1
- OpenAI Text-to-Speech

## Validation

- Zod
- TypeScript interfaces
- Runtime schema validation

## Development

- ESLint
- Prettier
- npm
- Git
- GitHub
- Codex

## Deployment

- Vercel

---

# Application Flow

## 1. Start

The user begins from the landing or start page.

## 2. Create

The child draws inside the application or uploads an existing image.

## 3. Prepare Drawing

The drawing is converted into a format that can be passed safely through the lesson pipeline.

## 4. Analyze

GPT-5.6 studies the drawing and returns structured visual information.

## 5. Plan Lesson

GPT-5.6 creates one focused educational objective and an age-appropriate activity.

## 6. Plan Scene

GPT-5.6 converts the lesson into a structured visual scene.

## 7. Generate Illustration

GPT Image 1 renders the educational illustration.

## 8. Narrate

OpenAI Text-to-Speech reads the lesson instructions aloud.

## 9. Answer

The child responds to the question.

## 10. Continue

The child can review progress or begin a new drawing.

---

# Project Structure

The exact file structure may continue to evolve, but the application is organized around the following responsibilities:

```text
app/
├── api/
│   ├── drawing-analysis/
│   ├── lessons/
│   ├── scenes/
│   └── voice/
│
├── draw/
├── lesson/
├── progress/
├── start/
└── page.tsx

components/
├── drawing/
├── lesson/
├── navigation/
└── shared UI components

lib/
├── lessons/
├── openai/
├── prompts/
├── scenes/
└── validation utilities

types/
├── drawing types
├── lesson types
└── scene types
```

---

# API Routes

The application uses server-side routes for AI functionality.

The route names should be treated as internal implementation details and may evolve, but the main responsibilities include:

## Drawing Analysis

Accepts the prepared drawing and returns validated structured information about its contents.

## Lesson Generation

Uses the drawing analysis and learner configuration to create a focused educational lesson.

## Scene Generation

Creates a scene specification and sends it to GPT Image 1.

A successful response returns:

```text
Content-Type: image/png
```

## Voice Narration

Accepts lesson narration text and returns playable audio generated by OpenAI Text-to-Speech.

---

# Structured AI Outputs

Structured outputs are central to Asobi’s architecture.

The project avoids relying on unpredictable free-form model responses for important application logic.

## Drawing Analysis

A drawing-analysis response may contain:

```ts
type DrawingAnalysis = {
  summary: string;
  primarySubject: string;
  secondarySubjects: string[];
  dominantColors: string[];
  accessories: string[];
  distinctiveFeatures: string[];
  facialExpression: string;
  pose: string;
  artStyle: string;
  composition: string;
  backgroundElements: string[];
};
```

## Lesson Plan

A lesson plan may contain:

```ts
type LessonPlan = {
  subject: string;
  title: string;
  introduction: string;
  objective: string;
  explanation: string;
  question: string;
  expectedAnswer: string;
};
```

## Scene Specification

A scene specification may contain:

```ts
type SceneSpecification = {
  purpose: string;
  primarySubject: string;
  requiredObjects: string[];
  visualIdentity: string[];
  composition: string;
  educationalRelationship: string;
  avoid: string[];
  altText: string;
};
```

The exact production schemas include additional validation and constraints.

---

# Session and State Management

Asobi currently uses browser session state for the active lesson journey.

Temporary state can include:

- The prepared drawing
- Drawing analysis
- Lesson information
- Active lesson status

The active lesson session uses a namespaced browser key.

Starting a new lesson clears the active lesson without intentionally deleting unrelated learning progress.

This approach was selected for the hackathon version because it:

- Avoids requiring account creation
- Reduces setup friction
- Keeps the experience fast
- Limits the amount of persistent personal data
- Makes the demo easier to use

A future production version could introduce authenticated parent or teacher accounts with appropriate privacy controls.

---

# Privacy and Safety Considerations

Asobi is designed for children, so privacy and safety are important considerations.

The current implementation follows several basic principles.

## Server-Side API Credentials

OpenAI credentials remain on the server.

They are not exposed through browser JavaScript or `NEXT_PUBLIC_` variables.

## Temporary Drawing State

The active drawing and lesson are kept in browser session storage rather than permanently uploaded into a user profile.

## Limited Logging

The application should not intentionally log:

- Full drawings
- Base64 image payloads
- Audio payloads
- Children’s answers
- API keys
- Full private prompt contents

## Focused Educational Outputs

Lesson prompts instruct the model to produce:

- Age-appropriate language
- Clear instructions
- One educational objective
- Non-frightening educational scenes
- Questions grounded in visible content

## Human Supervision

The current version is a hackathon prototype and should be used with adult supervision.

It is not a replacement for professional educational assessment or teacher judgment.

---

# Running Asobi Locally

## 1. Clone the repository

```bash
git clone https://github.com/Benita2001/Asobi.git
```

## 2. Enter the project directory

```bash
cd Asobi
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create the local environment file

Create:

```text
.env.local
```

Add the required environment variables.

Do not commit this file.

## 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Environment Variables

The application expects the following server-side environment variables:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=marin
```

## Important

Never expose the API key using a variable such as:

```text
NEXT_PUBLIC_OPENAI_API_KEY
```

OpenAI requests must remain on the server.

The `.env.local` file is ignored by Git and must not be committed.

For Vercel deployment, configure the variables separately for:

- Preview
- Production

---

# Validation and Testing

The project includes a repeatable quality-check workflow.

## Format the project

```bash
npm run format
```

## Run linting

```bash
npm run lint
```

## Run TypeScript checks

```bash
npm run typecheck
```

## Check formatting

```bash
npm run format:check
```

## Run tests

```bash
npm test
```

## Create a production build

```bash
npm run build
```

At the final GitHub synchronization checkpoint:

```text
Formatting: passed
Linting: passed
Type checking: passed
Format check: passed
Tests: 42 passed
Production build: passed
```

---

# Challenges

## Understanding Unstructured Children’s Drawings

Children’s drawings are expressive but unpredictable.

The system needed to interpret creative artwork without requiring perfect shapes or realistic proportions.

Structured GPT-5.6 analysis made it possible to capture both meaning and visual identity.

## Preventing Generic Lessons

The first lesson outputs could feel technically correct but disconnected from the drawing.

The prompts were improved so questions reference visible objects, colors, groups, or relationships from the child’s artwork.

## Avoiding Overly Complex Lessons

Early versions sometimes tried to teach several subjects at once.

The lesson planner was changed to require:

- One primary skill
- One objective
- One central activity

## Preserving the Original Drawing

The generated image sometimes became more prominent than the child’s work.

The lesson interface was updated to display both:

1. The original drawing
2. The AI-generated educational illustration

This keeps the child’s creation at the center of the experience.

## Preserving Visual Identity

Recognizing the subject was not enough.

A generic image of the same subject could still feel unrelated.

The drawing-analysis pipeline was expanded to capture colors, accessories, expressions, poses, composition, and background details.

## Structured Output Validation

The model initially returned data that did not fully match required schemas.

The schema and prompt were updated without removing runtime validation.

## GPT Image 1 Compatibility

An unsupported image-request option caused generation failures.

The integration was corrected while preserving PNG conversion and safe error handling.

## Browser Session Handoff

The original drawing was not always available after navigation.

The session structure was updated so the validated prepared drawing travels with the lesson.

## Local Next.js Runtime Issues

Multiple stale development servers caused missing-chunk and build-file errors.

The problem was resolved by stopping stale processes, removing old build output, and starting one clean server.

---

# What I Learned

## Personalization Requires More Than Inserting a Name

A lesson does not become personalized simply because it mentions the child or changes a few words.

It feels personalized when it uses something the child actually created.

## Model Outputs Need Clear Boundaries

Asking one model to perform visual understanding, curriculum planning, scene design, and final rendering in one request would have made the application difficult to control.

Separating the pipeline improved reliability.

## Structured Outputs Matter

Validated structured data made it easier to connect multiple AI stages safely.

It also made debugging more precise.

## Generated Images Need Planning

Image quality is not only about the image model.

The reasoning and scene specification sent to the image model strongly affect whether the result supports the lesson.

## The Original Work Must Remain Visible

The child’s drawing should not disappear once AI becomes involved.

AI should extend the child’s creativity, not replace it.

## AI-Assisted Development Still Requires Product Judgment

Codex could implement features quickly, but it could not decide whether a lesson felt right for a child without human direction and review.

The strongest improvements came from testing outputs, recognizing what felt wrong, and changing the architecture or prompts accordingly.

---

# Current Limitations

Asobi is currently a hackathon prototype.

Known limitations include:

- Lessons are generated one at a time.
- Progress is currently browser-based.
- No parent or teacher account system exists yet.
- Speech recognition depends on browser support.
- Generated images can take time to render.
- Some highly abstract drawings may be difficult to interpret.
- AI-generated educational content still benefits from adult supervision.
- The platform does not currently provide formal curriculum certification.
- Multilingual support is not yet fully implemented.

---

# Future Development

Future versions of Asobi could include:

## Adaptive Difficulty

Lessons could become easier or harder based on previous answers.

## Multi-Lesson Adventures

One drawing could create a sequence of connected activities rather than a single lesson.

## Parent Dashboard

Parents could review:

- Completed lessons
- Subjects practised
- Progress over time
- Areas where the child needs support

## Teacher Tools

Teachers could use drawings to create classroom activities or assign personalized exercises.

## Multilingual Learning

The same drawing could support language learning in multiple languages.

## Spoken Conversations

Children could answer lessons verbally and receive spoken feedback.

## Handwriting Recognition

Asobi could understand numbers, labels, and simple handwritten words included in drawings.

## Curriculum Mapping

Generated lessons could be mapped to recognized educational standards.

## Safe Persistent Profiles

With appropriate child-safety and privacy controls, learners could build a long-term portfolio of drawings and lessons.

## Collaborative Learning

Several children could combine drawings into one shared educational story.

---

# Built With

- OpenAI API
- GPT-5.6 Luna
- GPT Image 1
- OpenAI Text-to-Speech
- Next.js
- React
- TypeScript
- Tailwind CSS
- HTML5 Canvas
- Zod
- Vercel
- GitHub
- Codex
- ESLint
- Prettier

---

# Live Project

Try Asobi:

https://asobi-beta.vercel.app

View the source code:

https://github.com/Benita2001/Asobi

---

# Acknowledgements

Asobi was built for OpenAI Build Week.

The project uses GPT-5.6 as its visual reasoning, lesson-planning, and scene-planning engine.

GPT Image 1 generates the personalized educational illustrations.

OpenAI Text-to-Speech provides lesson narration.

Codex was used throughout the engineering process as an AI development collaborator for architecture, implementation, debugging, validation, repository management, and deployment preparation.

The central idea behind the project remains simple:

> Children imagine before they explain. Asobi turns that imagination into a personalized learning adventure.
