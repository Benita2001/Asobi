import type { ReactNode } from "react";

type PageHeaderProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}>;

export function PageHeader({
  action,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-amber-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="text-sm font-black tracking-widest text-teal-700 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
