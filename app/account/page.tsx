"use client";

import { useCallback, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderRequestForm } from "@/components/orders/OrderRequestForm";
import { TechnicalSpecificationCard } from "@/components/orders/TechnicalSpecificationCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { mapOrderRow, type OrderRow } from "@/lib/order-mappers";
import type { Order } from "@/types";

const orderSelect = "*, profiles(*), technical_specifications(*), consent_records(*), order_history(*)";

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clientName, setClientName] = useState("клиент");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setOrders([]);
      setMessage("Войдите, чтобы увидеть свои заявки и создать новый заказ.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select(orderSelect)
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .order("created_at", { foreignTable: "order_history", ascending: true });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    const mappedOrders = ((data ?? []) as OrderRow[]).map(mapOrderRow);
    setOrders(mappedOrders);
    setClientName(mappedOrders[0]?.client.fullName || userData.user.email || "клиент");
    setMessage("");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const selectedOrder = orders[0];

  return (
    <Section>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <SectionHeader eyebrow="Личный кабинет" title={`Здравствуйте, ${clientName}`} description="Здесь клиент видит только свои заявки, статусы, техническое задание и юридическую фиксацию подтверждения." />
        <LinkButton href="#new-request">Создать заявку</LinkButton>
      </div>

      {message ? <div className="mb-6 rounded-[1.5rem] bg-gold/10 p-5 text-sm text-graphite/70">{message} <LinkButton href="/login" className="ml-3" variant="secondary">Войти</LinkButton></div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <h2 className="font-serif text-3xl text-graphite">Мои заказы</h2>
          {isLoading ? <p className="text-sm text-graphite/60">Загружаем заказы из Supabase...</p> : null}
          {!isLoading && orders.length === 0 ? <p className="rounded-[1.5rem] bg-milk p-5 text-sm text-graphite/65">Пока нет заказов. Заполните форму справа, чтобы создать первую заявку.</p> : null}
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
        <div className="space-y-6">
          {selectedOrder ? <TechnicalSpecificationCard order={selectedOrder} /> : null}
          <div id="new-request"><OrderRequestForm onCreated={loadOrders} /></div>
        </div>
      </div>
    </Section>
  );
}
