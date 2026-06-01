import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[2rem] border border-beige/40 bg-cream/85 p-6 shadow-soft", className)}>{children}</div>;
}
