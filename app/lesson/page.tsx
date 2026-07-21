import type { Metadata } from "next";

import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "Learning adventure",
};

const conversationPlaceholders = [
  {
    title: "AI Narration",
    description: "The spoken lesson introduction will appear here.",
    icon: "🔊",
  },
  {
    title: "Voice Conversation",
    description: "Voice controls and a visible transcript will appear here.",
    icon: "🎙️",
  },
  {
    title: "Encouragement",
    description: "Supportive feedback will help the learner keep going.",
    icon: "⭐",
  },
  {
    title: "Next Question",
    description: "The next adaptive learning prompt will appear here.",
    icon: "➡️",
  },
];

export default function LessonPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <PageHeader
          eyebrow="Step 3 of 3"
          title="Your learning adventure"
          description="This screen represents the future voice-first lesson experience. Everything here is a visual placeholder."
          action={
            <ButtonLink href="/draw" variant="secondary">
              Back to drawing
            </ButtonLink>
          }
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-teal-200 bg-teal-50 p-7 sm:p-9">
            <section aria-labelledby="current-question-title">
              <p className="text-sm font-black tracking-widest text-teal-700 uppercase">
                Current Question
              </p>
              <h2
                id="current-question-title"
                className="mt-4 text-3xl font-black tracking-tight text-slate-900"
              >
                Your personalized question will appear here.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">
                In a later phase, this area will use the child&apos;s drawing
                and spoken answers to guide the lesson.
              </p>
              <div className="mt-8 flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 bg-white/70 font-bold text-teal-800">
                Voice response placeholder
              </div>
            </section>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {conversationPlaceholders.map((item) => (
              <Section
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
              >
                <div className="h-2 rounded-full bg-slate-100" />
              </Section>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <ButtonLink href="/progress">View progress placeholder</ButtonLink>
        </div>
      </Container>
    </main>
  );
}
