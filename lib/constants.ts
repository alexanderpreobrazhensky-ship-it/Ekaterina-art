import type { OrderStatus } from "@/types";

export const orderStatuses: OrderStatus[] = [
  "Новая заявка",
  "В обсуждении",
  "ТЗ подготовлено",
  "Ожидает подтверждения клиента",
  "Подтверждено клиентом",
  "Ожидает предоплаты",
  "В работе",
  "Готово",
  "Передано / отправлено",
  "Завершено",
];

export const currentLegalVersions = {
  offer: "offer-v1.0-2026-06-01",
  privacyPolicy: "privacy-v1.0-2026-06-01",
};
