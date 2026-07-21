import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";

export default function Home() {
  return (
    <main>
      <section className="py-16 sm:py-24 lg:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">
              Learning begins with imagination
            </p>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Asobi
            </h1>
            <p className="mt-6 max-w-2xl text-2xl leading-tight font-bold text-teal-800 sm:text-3xl">
              Turn every child&apos;s imagination into a personalized learning
              adventure.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Children create something they love, and Asobi turns their ideas
              into playful Mathematics and English activities made just for
              them.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/start" size="large">
                Start Learning
                <span aria-hidden="true">→</span>
              </ButtonLink>
              <ButtonLink href="/progress" variant="secondary" size="large">
                View Progress
              </ButtonLink>
            </div>
          </div>

          <Card className="relative overflow-hidden border-amber-200 bg-white p-7 sm:p-9">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-100" />
            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-teal-100" />
            <div className="relative space-y-5">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-2xl"
                aria-hidden="true"
              >
                ✏️
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Their picture. Their lesson.
              </h2>
              <ol className="space-y-4 text-slate-700">
                {[
                  "Choose an age group",
                  "Create or share a drawing",
                  "Explore a personalized lesson",
                ].map((step, index) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <span className="font-semibold">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}
