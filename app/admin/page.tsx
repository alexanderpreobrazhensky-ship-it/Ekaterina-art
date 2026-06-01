"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OrderCard } from "@/components/orders/OrderCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { orderStatuses } from "@/lib/constants";
import { mapOrderRow, type OrderRow } from "@/lib/order-mappers";
import type { Order, OrderStatus } from "@/types";

const orderSelect = "*, profiles(*), technical_specifications(*), consent_records(*), order_history(*)";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "Все статусы">("Все статусы");
  const [selectedOrderId, setSelectedOrderId] = useState<string>();
  const [message, setMessage] = useState("Загружаем заказы из Supabase...");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      const supabase = getSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const role = userData.user?.app_metadata?.role;
      const hasAdminRole = role === "admin" || userData.user?.app_metadata?.is_admin === true;
      setIsAdmin(hasAdminRole);

      if (!userData.user) {
        setMessage("Войдите под администратором Supabase, чтобы открыть список заказов.");
        return;
      }

      if (!hasAdminRole) {
        setMessage("Текущий пользователь не является администратором. RLS вернет только доступные ему записи.");
      }

      let query = supabase
        .from("orders")
        .select(orderSelect)
        .order("created_at", { ascending: false })
        .order("created_at", { foreignTable: "order_history", ascending: true });

      if (statusFilter !== "Все статусы") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        setMessage(error.message);
        return;
      }

      const mappedOrders = ((data ?? []) as OrderRow[]).map(mapOrderRow);
      setOrders(mappedOrders);
      setSelectedOrderId((current) => current ?? mappedOrders[0]?.id);
      setMessage(hasAdminRole ? "" : "Показаны только записи, разрешенные политиками RLS.");
    }

    loadOrders();
  }, [statusFilter]);

  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedOrderId) ?? orders[0], [orders, selectedOrderId]);

  return (
    <Section>
      <SectionHeader eyebrow="Админка MVP" title="Рабочее место мастера" description="Администратор с ролью app_metadata.role = admin видит все заявки, клиентские профили, ТЗ и историю действий." />
      {message ? <div className="mb-6 rounded-[1.5rem] bg-gold/10 p-5 text-sm text-graphite/70">{message}</div> : null}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <Card>
            <label>Фильтр по статусу<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "Все статусы")}><option>Все статусы</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            <p className="mt-3 text-xs text-graphite/50">Режим: {isAdmin ? "администратор — доступ ко всем заказам" : "обычный пользователь — доступ ограничен RLS"}</p>
          </Card>
          {orders.map((order) => <div key={order.id} className="space-y-3"><OrderCard order={order} compact /><Button variant="secondary" onClick={() => setSelectedOrderId(order.id)}>Открыть заказ</Button></div>)}
          {orders.length === 0 ? <p className="rounded-[1.5rem] bg-milk p-5 text-sm text-graphite/65">Заказы не найдены.</p> : null}
        </div>
        {selectedOrder ? (
          <div className="space-y-6">
            <Card>
              <p className="text-sm uppercase tracking-[0.22em] text-gold">Данные клиента</p>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <p><span className="text-graphite/45">Имя: </span>{selectedOrder.client.fullName}</p>
                <p><span className="text-graphite/45">Телефон: </span>{selectedOrder.client.phone}</p>
                <p><span className="text-graphite/45">Email: </span>{selectedOrder.client.email}</p>
                <p><span className="text-graphite/45">Город: </span>{selectedOrder.client.city}</p>
              </div>
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.22em] text-gold">Параметры заказа</p>
              <p className="mt-3 text-sm leading-6 text-graphite/70">{selectedOrder.wishes}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2"><label>Текущий статус<input readOnly value={selectedOrder.status} /></label><label>Плановый срок<input readOnly value={selectedOrder.desiredDeadline} /></label></div>
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.22em] text-gold">Техническое задание</p>
              {selectedOrder.technicalSpecification ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label>Тип изделия<input readOnly value={selectedOrder.technicalSpecification.productType} /></label>
                  <label>Размеры<input readOnly value={selectedOrder.technicalSpecification.dimensions} /></label>
                  <label>Стоимость<input readOnly value={selectedOrder.technicalSpecification.price} /></label>
                  <label>Предоплата<input readOnly value={selectedOrder.technicalSpecification.prepayment} /></label>
                  <label className="md:col-span-2">Комментарий мастера<textarea readOnly rows={4} value={selectedOrder.technicalSpecification.masterComment} /></label>
                </div>
              ) : <p className="mt-3 text-sm text-graphite/65">ТЗ еще не создано.</p>}
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.22em] text-gold">История действий</p>
              <div className="mt-5 space-y-4">
                {selectedOrder.history.map((item) => <div key={item.id} className="rounded-2xl bg-milk p-4"><p className="font-medium text-graphite">{item.event}</p><p className="mt-1 text-xs text-graphite/45">{new Date(item.createdAt).toLocaleString("ru-RU")} · {item.actor}</p><p className="mt-2 text-sm text-graphite/65">{item.description}</p></div>)}
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
