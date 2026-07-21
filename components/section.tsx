import type { ReactNode } from "react";

import { Card } from "@/components/card";

type SectionProps = Readonly<{
  children: ReactNode;
  description?: string;
  icon?: string;
  title: string;
}>;

export function Section({ children, description, icon, title }: SectionProps) {
  return (
    <Card className="p-6 sm:p-8">
      <section
        aria-labelledby={`section-${title.toLowerCase().replaceAll(" ", "-")}`}
      >
        <div className="flex items-start gap-4">
          {icon ? (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl"
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : null}
          <div>
            <h2
              id={`section-${title.toLowerCase().replaceAll(" ", "-")}`}
              className="text-xl font-black text-slate-900"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 leading-7 text-slate-600">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </Card>
  );
}
