import type { Metadata } from "next";

import { Container } from "@/components/container";
import { DrawingWorkspace } from "@/components/drawing/drawing-workspace";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Create a drawing",
};

export default function DrawPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <PageHeader
          eyebrow="Step 2 of 3"
          title="Create something wonderful"
          description="Draw a new picture or choose one made somewhere else. Your drawing stays on this device during this phase."
        />
        <div className="mt-10">
          <DrawingWorkspace />
        </div>
      </Container>
    </main>
  );
}
