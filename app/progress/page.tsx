import type { Metadata } from "next";

import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Learning progress",
};

const summary = [
  {
    label: "Lessons Completed",
    value: "3",
    icon: "✓",
    accent: "bg-teal-100 text-teal-800",
  },
  {
    label: "Favorite Subject",
    value: "Mathematics",
    icon: "+",
    accent: "bg-amber-100 text-amber-800",
  },
  {
    label: "Current Learning Level",
    value: "Growing Explorer",
    icon: "↑",
    accent: "bg-sky-100 text-sky-800",
  },
  {
    label: "Recent Achievement",
    value: "Pattern Spotter",
    icon: "★",
    accent: "bg-rose-100 text-rose-800",
  },
];

export default function ProgressPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <PageHeader
          eyebrow="Learning progress"
          title="Look how much you're growing"
          description="A simple, encouraging summary will help families celebrate progress over time. These values are static placeholders."
          action={
            <ButtonLink href="/start">Start another adventure</ButtonLink>
          }
        />

        <dl className="mt-10 grid gap-5 sm:grid-cols-2">
          {summary.map((item) => (
            <Card key={item.label} className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${item.accent}`}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div>
                  <dt className="text-sm font-bold text-slate-500">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-black text-slate-900">
                    {item.value}
                  </dd>
                </div>
              </div>
            </Card>
          ))}
        </dl>

        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center text-sm leading-6 text-amber-900">
          Progress tracking is not active yet. No information is being saved.
        </div>
      </Container>
    </main>
  );
}
