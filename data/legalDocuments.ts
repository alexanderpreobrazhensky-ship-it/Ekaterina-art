import type { LegalDocument } from "@/types";

export const legalDocuments: LegalDocument[] = [
  {
    id: "offer",
    title: "Договор-оферта",
    version: "offer-v1.0-2026-06-01",
    description: "Условия оформления, согласования, оплаты и передачи индивидуального изделия.",
    updatedAt: "2026-06-01",
    href: "#offer",
  },
  {
    id: "privacy",
    title: "Политика обработки персональных данных",
    version: "privacy-v1.0-2026-06-01",
    description: "Правила хранения и обработки контактных данных клиента для заказа и связи.",
    updatedAt: "2026-06-01",
    href: "#privacy",
  },
  {
    id: "personal-data-consent",
    title: "Согласие на обработку персональных данных",
    version: "consent-v1.0-2026-06-01",
    description: "Фиксация добровольного согласия клиента на обработку данных в рамках заказа.",
    updatedAt: "2026-06-01",
    href: "#personal-data-consent",
  },
  {
    id: "custom-made-terms",
    title: "Условия изготовления индивидуального изделия",
    version: "custom-v1.0-2026-06-01",
    description: "Особенности ручной работы, согласования ТЗ, сроков, предоплаты и оттенков.",
    updatedAt: "2026-06-01",
    href: "#custom-made-terms",
  },
];
