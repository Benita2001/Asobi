import type { Metadata } from "next";

import { AgeSelector } from "@/components/age-selector";
import { ButtonLink } from "@/components/button";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Choose an age",
};

export default function StartPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <PageHeader
          eyebrow="Step 1 of 3"
          title="Who is learning today?"
          description="Choose an age group so each activity can feel comfortable, encouraging, and just challenging enough."
          action={
            <ButtonLink href="/" variant="secondary">
              Back home
            </ButtonLink>
          }
        />
        <div className="mt-10">
          <AgeSelector />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Your choice lasts for this browser session and is not permanent
          learning memory.
        </p>
      </Container>
    </main>
  );
}
