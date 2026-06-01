import { LinkButton } from "@/components/ui/Button";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderRequestForm } from "@/components/orders/OrderRequestForm";
import { TechnicalSpecificationCard } from "@/components/orders/TechnicalSpecificationCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { orders } from "@/data/orders";

export default function AccountPage() {
  const clientOrder = orders[0];

  return (
    <Section>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <SectionHeader eyebrow="Личный кабинет" title={`Здравствуйте, ${clientOrder.client.fullName}`} description="Здесь клиент видит заявки, статусы, техническое задание и юридическую фиксацию подтверждения." />
        <LinkButton href="#new-request">Создать заявку</LinkButton>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <h2 className="font-serif text-3xl text-graphite">Мои заказы</h2>
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
        <div className="space-y-6">
          <TechnicalSpecificationCard order={clientOrder} />
          <div id="new-request"><OrderRequestForm /></div>
        </div>
      </div>
    </Section>
  );
}
