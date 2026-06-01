import type { OrderStatus } from "@/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-graphite">{status}</span>;
}
