"use client";

import { useRef, useState } from "react";

import { Button, ButtonLink } from "@/components/button";
import { DrawingCanvas } from "@/components/drawing/drawing-canvas";
import { DrawingPreview } from "@/components/drawing/drawing-preview";
import { DrawingUpload } from "@/components/drawing/drawing-upload";
import { Section } from "@/components/section";
import { useJourneyState } from "@/hooks/use-journey-state";
import { isPreparedDrawing } from "@/lib/drawing/validation";
import type { PreparedDrawing } from "@/types/drawing";
import type { AgeGroup } from "@/types/journey";

const ageLabels: Record<AgeGroup, string> = {
  "4-6": "Ages 4–6",
  "7-9": "Ages 7–9",
  "10-12": "Ages 10–12",
};

type PreparedMetadata = Omit<PreparedDrawing, "dataUrl">;

export function DrawingWorkspace() {
  const { ageGroup, isLoaded } = useJourneyState();
  const [preparedDrawing, setPreparedDrawing] =
    useState<PreparedDrawing | null>(null);
  const [canvasResetToken, setCanvasResetToken] = useState(0);
  const [uploadResetToken, setUploadResetToken] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preparedMetadata, setPreparedMetadata] =
    useState<PreparedMetadata | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  if (!isLoaded) {
    return (
      <div
        className="rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"
        aria-live="polite"
      >
        <p className="font-bold text-slate-700">
          Preparing your drawing space…
        </p>
      </div>
    );
  }

  if (!ageGroup) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
        <span className="text-3xl" aria-hidden="true">
          👋
        </span>
        <h2 className="mt-4 text-2xl font-black text-slate-900">
          Let&apos;s choose an age group first
        </h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
          This helps Asobi prepare the right kind of learning adventure. Your
          choice lasts only for this browser session.
        </p>
        <div className="mt-6">
          <ButtonLink href="/start">Choose an age group</ButtonLink>
        </div>
      </div>
    );
  }

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
    requestAnimationFrame(() => messageRef.current?.focus());
  }

  function activateCanvas() {
    if (preparedDrawing?.source === "upload") {
      setPreparedDrawing(null);
      setPreparedMetadata(null);
      setUploadResetToken((token) => token + 1);
    }
    setMessage(null);
  }

  function handleCanvasDrawing(drawing: PreparedDrawing | null) {
    if (!drawing && preparedDrawing?.source !== "canvas") {
      return;
    }

    setPreparedDrawing(drawing);
    setPreparedMetadata(null);
    if (drawing) {
      setMessage(null);
    }
  }

  function handleUploadDrawing(drawing: PreparedDrawing) {
    setCanvasResetToken((token) => token + 1);
    setPreparedDrawing(drawing);
    setPreparedMetadata(null);
    setMessage(null);
  }

  function clearCurrentDrawing() {
    if (preparedDrawing?.source === "canvas") {
      setCanvasResetToken((token) => token + 1);
    } else if (preparedDrawing?.source === "upload") {
      setUploadResetToken((token) => token + 1);
    }
    setPreparedDrawing(null);
    setPreparedMetadata(null);
    setMessage(null);
  }

  async function createLesson() {
    setPreparedMetadata(null);

    if (!isPreparedDrawing(preparedDrawing)) {
      showMessage(
        "Add a drawing or choose an image before creating your lesson.",
      );
      return;
    }

    setMessage(null);
    setIsProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const { dataUrl: _dataUrl, ...metadata } = preparedDrawing;
    void _dataUrl;
    setPreparedMetadata(metadata);
    setIsProcessing(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-teal-700">Learning level</p>
          <p className="text-lg font-black text-teal-950">
            {ageLabels[ageGroup]}
          </p>
        </div>
        <ButtonLink href="/start" variant="secondary">
          Change age
        </ButtonLink>
      </div>

      {message ? (
        <div
          ref={messageRef}
          className="rounded-2xl border border-rose-300 bg-rose-50 p-4 font-bold text-rose-900 focus-visible:ring-4 focus-visible:ring-rose-200 focus-visible:outline-none"
          role="alert"
          tabIndex={-1}
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Section
          icon="✏️"
          title="Drawing Canvas"
          description="Make a simple picture with child-friendly drawing tools."
        >
          <DrawingCanvas
            resetToken={canvasResetToken}
            onActivate={activateCanvas}
            onDrawingChange={handleCanvasDrawing}
          />
        </Section>

        <div className="grid content-start gap-6">
          <Section
            icon="🖼️"
            title="Upload Drawing"
            description="Choose a drawing made somewhere else. Selecting one replaces the canvas submission."
          >
            <DrawingUpload
              resetToken={uploadResetToken}
              onDrawingReady={handleUploadDrawing}
              onValidationError={showMessage}
            />
          </Section>

          <Section
            icon="✨"
            title="Current Drawing"
            description="Only this drawing will be prepared for the next phase."
          >
            <DrawingPreview
              drawing={preparedDrawing}
              onClear={clearCurrentDrawing}
            />
          </Section>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Ready for the next step?
            </h2>
            <p className="mt-1 leading-7 text-slate-600">
              This phase prepares the drawing locally. Nothing is sent to AI or
              external storage.
            </p>
          </div>
          <Button
            className="shrink-0"
            size="large"
            disabled={isProcessing}
            onClick={createLesson}
          >
            {isProcessing ? "Preparing drawing…" : "Create My Lesson"}
          </Button>
        </div>

        {preparedMetadata ? (
          <div
            className="mt-6 rounded-2xl border border-teal-300 bg-white p-5"
            role="status"
          >
            <p className="font-black text-teal-800">
              Development handoff ready
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="font-bold text-slate-500">Source</dt>
                <dd className="mt-1 text-slate-900">
                  {preparedMetadata.source}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">MIME type</dt>
                <dd className="mt-1 text-slate-900">
                  {preparedMetadata.mimeType}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Dimensions</dt>
                <dd className="mt-1 text-slate-900">
                  {preparedMetadata.width} × {preparedMetadata.height}
                </dd>
              </div>
              {preparedMetadata.sizeBytes !== undefined ? (
                <div>
                  <dt className="font-bold text-slate-500">File size</dt>
                  <dd className="mt-1 text-slate-900">
                    {preparedMetadata.sizeBytes.toLocaleString()} bytes
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}
