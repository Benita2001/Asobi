import Link from "next/link";

import { Container } from "@/components/container";

const navigation = [
  { href: "/start", label: "Start" },
  { href: "/draw", label: "Create" },
  { href: "/lesson", label: "Lesson" },
  { href: "/progress", label: "Progress" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-amber-200 bg-white/90">
      <Container className="flex flex-col items-stretch gap-2 py-3 sm:min-h-18 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <Link
          className="rounded-lg text-2xl font-black tracking-tight text-teal-800 focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:outline-none"
          href="/"
        >
          Asobi
        </Link>
        <nav
          aria-label="Main navigation"
          className="w-full overflow-x-auto sm:w-auto"
        >
          <ul className="flex items-center justify-between gap-1 sm:justify-start sm:gap-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-11 items-center rounded-full px-3 font-bold whitespace-nowrap text-slate-600 transition-colors hover:bg-amber-50 hover:text-teal-800 focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:outline-none sm:px-4"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
