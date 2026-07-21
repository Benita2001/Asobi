import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-amber-200 bg-white py-6">
      <Container className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-teal-800">Asobi</p>
        <p>Every imagination can become a learning adventure.</p>
      </Container>
    </footer>
  );
}
