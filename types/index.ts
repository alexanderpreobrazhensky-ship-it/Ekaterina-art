export type OrderStatus =
  | "Новая заявка"
  | "В обсуждении"
  | "ТЗ подготовлено"
  | "Ожидает подтверждения клиента"
  | "Подтверждено клиентом"
  | "Ожидает предоплаты"
  | "В работе"
  | "Готово"
  | "Передано / отправлено"
  | "Завершено";

export type PortfolioCategory =
  | "Барельефы"
  | "Зеркала"
  | "Светильники"
  | "Объёмные картины"
  | "Декор для бизнеса";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  preferredContact: "Telegram" | "WhatsApp" | "Телефон" | "Email";
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  size: string;
  description: string;
  accent: string;
}

export interface TechnicalSpecification {
  productType: string;
  dimensions: string;
  colorTone: string;
  texture: string;
  materials: string;
  price: string;
  prepayment: string;
  productionTime: string;
  deliveryMethod: string;
  masterComment: string;
  attachments: string[];
}

export interface ConsentRecord {
  confirmedAt: string;
  clientEmail: string;
  clientPhone: string;
  offerVersion: string;
  privacyPolicyVersion: string;
  ipAddress: string;
  status: "ТЗ подтверждено клиентом";
}

export interface OrderHistoryEvent {
  id: string;
  event:
    | "заявка создана"
    | "мастер изменил статус"
    | "мастер подготовил ТЗ"
    | "клиент подтвердил ТЗ"
    | "предоплата ожидается"
    | "заказ переведен в работу"
    | "заказ готов";
  createdAt: string;
  actor: "Клиент" | "Мастер" | "Система";
  description: string;
}

export interface Order {
  id: string;
  number: string;
  client: UserProfile;
  status: OrderStatus;
  productType: string;
  approximateSize: string;
  wishes: string;
  budget: string;
  desiredDeadline: string;
  createdAt: string;
  technicalSpecification?: TechnicalSpecification;
  consentRecord?: ConsentRecord;
  history: OrderHistoryEvent[];
}

export interface LegalDocument {
  id: string;
  title: string;
  version: string;
  description: string;
  updatedAt: string;
  href: string;
}
