"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, ButtonLink } from "@/components/button";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import {
  LESSON_STORAGE_KEY,
  parseLessonSession,
} from "@/lib/lessons/session-state";
import type { LessonSessionState } from "@/types/lesson";
import { useVoice } from "@/hooks/use-voice";
import { resolveSpokenAnswer } from "@/lib/voice/transcript";
import {
  recordLesson,
  updatePreferredInteraction,
} from "@/lib/memory/learning-memory";
import { buildLessonNarration } from "@/lib/voice/narration";
import { planScene } from "@/lib/scenes/plan-scene";

export default function LessonPage() {
  const [session, setSession] = useState<LessonSessionState | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [hint, setHint] = useState(false);
  const [sceneUrl, setSceneUrl] = useState<string | null>(null);
  const [sceneError, setSceneError] = useState(false);
  const sceneKeyRef = useRef<string | null>(null);
  const recordedRef = useRef(false);
  const handleTranscript = useCallback(
    (transcript: string) => setAnswer(transcript),
    [],
  );
  const voice = useVoice(handleTranscript);
  useEffect(() => {
    setSession(parseLessonSession(sessionStorage.getItem(LESSON_STORAGE_KEY)));
  }, []);
  useEffect(() => {
    if (!session || sceneKeyRef.current === session.lesson.id) return;
    sceneKeyRef.current = session.lesson.id;
    let cancelled = false;
    const scene = planScene(
      session.lesson,
      session.drawingAnalysis,
      session.ageGroup,
    );
    fetch("/api/scenes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scene }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("SCENE_UNAVAILABLE");
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        setSceneUrl(URL.createObjectURL(blob));
      })
      .catch(() => {
        if (!cancelled) setSceneError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);
  useEffect(
    () => () => {
      if (sceneUrl) URL.revokeObjectURL(sceneUrl);
    },
    [sceneUrl],
  );
  if (!session)
    return (
      <main className="py-16">
        <Container>
          <PageHeader
            eyebrow="Learning adventure"
            title="Let’s make a new activity"
            description="This lesson session is missing or has expired."
            action={<ButtonLink href="/draw">Back to drawing</ButtonLink>}
          />
        </Container>
      </main>
    );
  const { lesson } = session;
  const spokenInstructions = buildLessonNarration(lesson);
  function submit() {
    const evaluatedAnswer = resolveSpokenAnswer(answer, lesson.activity.choices)
      .trim()
      .toLowerCase();
    const expected = lesson.activity.expectedAnswer;
    const accepted = [
      expected.value,
      ...(expected.acceptedAlternatives ?? []),
    ].map((item) => item.trim().toLowerCase());
    setCorrect(accepted.includes(evaluatedAnswer));
    setSubmitted(true);
    if (accepted.includes(evaluatedAnswer) && !recordedRef.current) {
      recordLesson(lesson, true, 1, "auto");
      recordedRef.current = true;
    }
  }
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <PageHeader
          eyebrow={lesson.subject === "math" ? "Mathematics" : "English"}
          title={lesson.title}
          description={lesson.drawingConnection}
          action={
            <ButtonLink href="/draw" variant="secondary">
              Back to drawing
            </ButtonLink>
          }
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-6">
          <section
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            aria-label="Voice controls"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => voice.speak(spokenInstructions)}
                disabled={voice.isNarrating || voice.isSpeaking}
                aria-label="Speak lesson instructions"
              >
                {voice.isNarrating
                  ? "Preparing audio…"
                  : voice.isSpeaking
                    ? "Speaking…"
                    : "Speak instructions"}
              </Button>
              <Button
                onClick={voice.stopSpeaking}
                variant="secondary"
                disabled={!voice.isSpeaking}
                aria-label="Stop speaking"
              >
                Stop
              </Button>
              <span
                className="text-sm font-bold text-slate-600"
                role="status"
                aria-live="polite"
              >
                {voice.isSpeaking
                  ? "Asobi is speaking"
                  : voice.speechSupported
                    ? "Ready to speak"
                    : "Speech playback is unavailable; read the instructions below."}
              </span>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Voice narration is AI-generated.
            </p>
          </section>
          <section className="rounded-3xl border border-teal-200 bg-teal-50 p-7 sm:p-9">
            <p className="text-lg leading-8 text-slate-700">
              {lesson.introduction}
            </p>
            <p className="mt-4 font-bold text-teal-900">
              Goal: {lesson.learningObjective}
            </p>
          </section>
          <section
            className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm"
            aria-label="AI educational illustration"
          >
            <h2 className="text-xl font-black text-slate-900">
              AI Educational Illustration
            </h2>
            {sceneUrl ? (
              <Image
                unoptimized
                width={1024}
                height={1024}
                className="mt-4 aspect-square w-full rounded-2xl object-cover"
                src={sceneUrl}
                alt={
                  planScene(lesson, session.drawingAnalysis, session.ageGroup)
                    .altText
                }
              />
            ) : sceneError ? (
              <p className="mt-4 rounded-xl bg-white p-4 font-bold text-amber-900">
                We couldn&apos;t create the lesson picture this time.
              </p>
            ) : (
              <p className="mt-4 text-slate-700" role="status">
                Creating a picture to help explain this lesson…
              </p>
            )}
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-2xl font-black text-slate-900">
              {lesson.activity.prompt}
            </h2>
            {lesson.activity.type === "multiple_choice" ? (
              <div className="mt-6 grid gap-3">
                {lesson.activity.choices?.map((choice) => (
                  <label
                    key={choice.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 font-bold has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal-200"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={choice.id}
                      checked={answer === choice.id}
                      onChange={() => setAnswer(choice.id)}
                    />
                    {choice.label}
                  </label>
                ))}
              </div>
            ) : lesson.activity.type === "short_answer" ? (
              <input
                className="mt-6 w-full rounded-2xl border border-slate-300 px-4 py-3 text-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 focus:outline-none"
                maxLength={100}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                aria-label="Your answer"
              />
            ) : (
              <p className="mt-6 rounded-2xl bg-amber-50 p-4 font-bold text-amber-900">
                When you finish the drawing action, press Done.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  updatePreferredInteraction("voice");
                  voice.startListening();
                }}
                variant="secondary"
                disabled={!voice.recognitionSupported || voice.isListening}
                aria-label="Speak your answer"
              >
                {voice.isListening ? "Listening…" : "Speak answer"}
              </Button>
              <Button
                onClick={voice.stopListening}
                variant="secondary"
                disabled={!voice.isListening}
                aria-label="Stop listening"
              >
                Stop microphone
              </Button>
              <Button onClick={() => setHint(true)} variant="secondary">
                Show hint
              </Button>
              <Button
                onClick={
                  lesson.activity.type === "drawing_action"
                    ? () => {
                        setAnswer("done");
                        setSubmitted(true);
                        setCorrect(true);
                        if (!recordedRef.current) {
                          recordLesson(lesson, true, 1, "auto");
                          recordedRef.current = true;
                        }
                      }
                    : submit
                }
                disabled={!answer && lesson.activity.type !== "drawing_action"}
              >
                {lesson.activity.type === "drawing_action"
                  ? "Done"
                  : "Submit answer"}
              </Button>
            </div>
            {voice.isListening ? (
              <p
                className="mt-3 rounded-xl bg-teal-50 p-3 font-bold text-teal-900"
                role="status"
                aria-live="polite"
              >
                Listening for your answer…
              </p>
            ) : null}
            {voice.voiceError ? (
              <p
                className="mt-3 rounded-xl bg-amber-50 p-3 font-bold text-amber-900"
                role="alert"
              >
                {voice.voiceError}
              </p>
            ) : null}
            {hint ? (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-slate-700">
                {lesson.activity.hint}
              </p>
            ) : null}
            {submitted ? (
              <div
                className={`mt-5 rounded-2xl p-4 font-bold ${correct ? "bg-teal-50 text-teal-900" : "bg-amber-50 text-amber-900"}`}
                role="status"
              >
                {correct
                  ? lesson.completionMessage
                  : "Almost—try looking at your drawing again."}
                {!correct ? (
                  <Button className="mt-3" onClick={() => setSubmitted(false)}>
                    Try again
                  </Button>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>
      </Container>
    </main>
  );
}
