"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Order } from "@/types";

const confirmations = [
  "Я проверил(а) параметры изделия и подтверждаю ТЗ",
  "Я согласен(на) со стоимостью, сроками и размером предоплаты",
  "Я понимаю, что изделие изготавливается индивидуально под мой заказ",
  "Я согласен(на) с актуальной версией договора-оферты",
];

export function TechnicalSpecificationCard({ order }: { order: Order }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(Boolean(order.consentRecord));
  const spec = order.technicalSpecification;
  const canConfirm = useMemo(() => confirmations.every((item) => checked[item]), [checked]);

  if (!spec) {
    return <Card><p className="text-sm text-graphite/65">Техническое задание еще не подготовлено мастером.</p></Card>;
  }

  const fields = [
    ["Тип изделия", spec.productType],
    ["Размеры", spec.dimensions],
    ["Цвет / оттенок", spec.colorTone],
    ["Фактура", spec.texture],
    ["Материалы", spec.materials],
    ["Стоимость", spec.price],
    ["Размер предоплаты", spec.prepayment],
    ["Срок изготовления", spec.productionTime],
    ["Способ получения", spec.deliveryMethod],
    ["Комментарий мастера", spec.masterComment],
  ];

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-gold">Техническое задание</p>
        <h3 className="mt-2 font-serif text-3xl text-graphite">Параметры для согласования</h3>
      </div>
      <dl className="grid gap-4 md:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-milk p-4">
            <dt className="text-xs uppercase tracking-[0.18em] text-graphite/45">{label}</dt>
            <dd className="mt-2 text-sm leading-6 text-graphite/80">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="rounded-[1.5rem] border border-dashed border-gold/50 bg-milk p-5">
        <p className="font-medium text-graphite">Прикрепленные эскизы/фото</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {spec.attachments.map((attachment) => <span key={attachment} className="rounded-full bg-cream px-3 py-1 text-xs text-graphite/65">{attachment}</span>)}
        </div>
      </div>
      {!confirmed ? (
        <div className="space-y-3">
          {confirmations.map((text) => (
            <label key={text} className="flex items-start gap-3 rounded-2xl bg-milk p-4 text-sm">
              <input className="mt-1 h-4 w-4" type="checkbox" checked={Boolean(checked[text])} onChange={(event) => setChecked((state) => ({ ...state, [text]: event.target.checked }))} />
              <span>{text}</span>
            </label>
          ))}
          <Button disabled={!canConfirm} className="disabled:cursor-not-allowed disabled:opacity-45" onClick={() => canConfirm && setConfirmed(true)}>Подтверждаю техническое задание</Button>
          <p className="text-xs text-graphite/55">Кнопка заблокирована, пока не отмечены все обязательные юридические чекбоксы.</p>
        </div>
      ) : null}
      {confirmed && order.consentRecord ? (
        <div className="rounded-[1.5rem] border border-gold/40 bg-gold/10 p-5">
          <p className="font-medium text-graphite">Юридическая фиксация</p>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div><dt className="text-graphite/50">Дата и время подтверждения</dt><dd>{new Date(order.consentRecord.confirmedAt).toLocaleString("ru-RU")}</dd></div>
            <div><dt className="text-graphite/50">Email клиента</dt><dd>{order.consentRecord.clientEmail}</dd></div>
            <div><dt className="text-graphite/50">Телефон клиента</dt><dd>{order.consentRecord.clientPhone}</dd></div>
            <div><dt className="text-graphite/50">Версия оферты</dt><dd>{order.consentRecord.offerVersion}</dd></div>
            <div><dt className="text-graphite/50">Версия политики ПДн</dt><dd>{order.consentRecord.privacyPolicyVersion}</dd></div>
            <div><dt className="text-graphite/50">IP-адрес</dt><dd>{order.consentRecord.ipAddress}</dd></div>
            <div><dt className="text-graphite/50">Статус</dt><dd>{order.consentRecord.status}</dd></div>
          </dl>
        </div>
      ) : null}
    </Card>
  );
}
