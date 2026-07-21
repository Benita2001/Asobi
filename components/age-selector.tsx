"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useJourneyState } from "@/hooks/use-journey-state";
import type { AgeGroup } from "@/types/journey";

type AgeGroupOption = Readonly<{
  value: AgeGroup;
  label: string;
  description: string;
  accent: string;
}>;

const ageGroups: readonly AgeGroupOption[] = [
  {
    value: "4-6",
    label: "Ages 4–6",
    description: "Playful first steps with simple words and numbers.",
    accent: "bg-rose-100 text-rose-700",
  },
  {
    value: "7-9",
    label: "Ages 7–9",
    description: "Growing skills through stories, patterns, and puzzles.",
    accent: "bg-amber-100 text-amber-800",
  },
  {
    value: "10-12",
    label: "Ages 10–12",
    description: "Bigger ideas, thoughtful challenges, and creative thinking.",
    accent: "bg-teal-100 text-teal-800",
  },
];

export function AgeSelector() {
  const router = useRouter();
  const { setAgeGroup } = useJourneyState();
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);

  function selectAge(age: AgeGroup) {
    setSelectedAge(age);
    setAgeGroup(age);
    router.push("/draw");
  }

  return (
    <fieldset>
      <legend className="sr-only">Choose an age group</legend>
      <div className="grid gap-5 md:grid-cols-3">
        {ageGroups.map((group, index) => {
          const isSelected = selectedAge === group.value;

          return (
            <button
              key={group.label}
              className="group min-h-52 rounded-3xl border-2 border-slate-200 bg-white p-6 text-left shadow-[0_18px_50px_-32px_rgba(15,23,42,0.4)] transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:outline-none disabled:cursor-wait"
              disabled={selectedAge !== null}
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectAge(group.value)}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black ${group.accent}`}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="mt-6 block text-2xl font-black text-slate-900 group-hover:text-teal-800">
                {group.label}
              </span>
              <span className="mt-3 block leading-7 text-slate-600">
                {group.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
