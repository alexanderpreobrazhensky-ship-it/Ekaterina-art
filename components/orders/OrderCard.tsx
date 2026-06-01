import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/orders/StatusBadge";
import type { Order } from "@/types";

export function OrderCard({ order, compact = false }: { order: Order; compact?: boolean }) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-graphite/50">Заказ {order.number}</p>
          <h3 className="mt-1 font-serif text-2xl text-graphite">{order.productType}</h3>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="grid gap-3 text-sm text-graphite/70 sm:grid-cols-2">
        <p><span className="text-graphite/45">Размер: </span>{order.approximateSize}</p>
        <p><span className="text-graphite/45">Бюджет: </span>{order.budget}</p>
        <p><span className="text-graphite/45">Срок: </span>{order.desiredDeadline}</p>
        <p><span className="text-graphite/45">Создан: </span>{new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
      </div>
      {!compact ? <p className="text-sm leading-6 text-graphite/65">{order.wishes}</p> : null}
    </Card>
  );
}
