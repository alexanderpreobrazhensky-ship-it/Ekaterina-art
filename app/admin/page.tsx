import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OrderCard } from "@/components/orders/OrderCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { orders } from "@/data/orders";
import { orderStatuses } from "@/lib/constants";

export default function AdminPage() {
  const selectedOrder = orders[0];

  return (
    <Section>
      <SectionHeader eyebrow="Админка MVP" title="Рабочее место мастера" description="Страница показывает будущую структуру управления заявками, статусами, ТЗ и историей действий без подключения базы данных." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <Card>
            <label>Фильтр по статусу<select defaultValue="Все статусы"><option>Все статусы</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          </Card>
          {orders.map((order) => <div key={order.id} className="space-y-3"><OrderCard order={order} compact /><Button variant="secondary">Открыть заказ</Button></div>)}
        </div>
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
            <div className="mt-4 grid gap-4 md:grid-cols-2"><label>Изменение статуса<select defaultValue={selectedOrder.status}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Плановый срок<input defaultValue={selectedOrder.desiredDeadline} /></label></div>
          </Card>
          <Card>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">Редактирование ТЗ</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>Тип изделия<input defaultValue={selectedOrder.technicalSpecification?.productType} /></label>
              <label>Размеры<input defaultValue={selectedOrder.technicalSpecification?.dimensions} /></label>
              <label>Стоимость<input defaultValue={selectedOrder.technicalSpecification?.price} /></label>
              <label>Предоплата<input defaultValue={selectedOrder.technicalSpecification?.prepayment} /></label>
              <label className="md:col-span-2">Комментарий мастера<textarea rows={4} defaultValue={selectedOrder.technicalSpecification?.masterComment} /></label>
            </div>
          </Card>
          <Card>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">История действий</p>
            <div className="mt-5 space-y-4">
              {selectedOrder.history.map((item) => <div key={item.id} className="rounded-2xl bg-milk p-4"><p className="font-medium text-graphite">{item.event}</p><p className="mt-1 text-xs text-graphite/45">{new Date(item.createdAt).toLocaleString("ru-RU")} · {item.actor}</p><p className="mt-2 text-sm text-graphite/65">{item.description}</p></div>)}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
