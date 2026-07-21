import type { ReactNode } from "react";

type CardProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}
