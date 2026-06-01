import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20", className)}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow ? <p className="mb-3 text-sm uppercase tracking-[0.28em] text-gold">{eyebrow}</p> : null}
      <h2 className="font-serif text-3xl leading-tight text-graphite sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-graphite/70">{description}</p> : null}
    </div>
  );
}
