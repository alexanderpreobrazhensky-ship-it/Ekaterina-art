import type { Order, OrderHistoryEvent, OrderStatus, PreferredContact, TechnicalSpecification, UserProfile } from "@/types";

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  preferred_contact: PreferredContact | null;
}

interface TechnicalSpecificationRow {
  dimensions: string | null;
  color_tone: string | null;
  texture: string | null;
  materials: string | null;
  price: string | null;
  prepayment: string | null;
  production_time: string | null;
  delivery_method: string | null;
  master_comment: string | null;
}

interface ConsentRecordRow {
  confirmed_at: string | null;
  offer_version: string | null;
  privacy_policy_version: string | null;
  ip_address: string | null;
  created_at: string | null;
}

interface OrderHistoryRow {
  id: string;
  event_type: OrderHistoryEvent["event"] | string | null;
  actor: OrderHistoryEvent["actor"] | string | null;
  description: string | null;
  created_at: string | null;
}

export interface OrderRow {
  id: string;
  user_id: string;
  status: OrderStatus | string | null;
  product_type: string | null;
  approximate_size: string | null;
  wishes: string | null;
  budget: string | null;
  desired_deadline: string | null;
  created_at: string | null;
  profiles?: ProfileRow | ProfileRow[] | null;
  technical_specifications?: TechnicalSpecificationRow[] | null;
  consent_records?: ConsentRecordRow[] | null;
  order_history?: OrderHistoryRow[] | null;
}

function normalizeProfile(row: OrderRow): UserProfile {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: profile?.id ?? row.user_id,
    fullName: profile?.full_name ?? "Клиент",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    city: profile?.city ?? "",
    preferredContact: profile?.preferred_contact ?? "Email",
  };
}

function normalizeSpecification(row: TechnicalSpecificationRow | undefined, productType: string): TechnicalSpecification | undefined {
  if (!row) {
    return undefined;
  }

  return {
    productType,
    dimensions: row.dimensions ?? "",
    colorTone: row.color_tone ?? "",
    texture: row.texture ?? "",
    materials: row.materials ?? "",
    price: row.price ?? "",
    prepayment: row.prepayment ?? "",
    productionTime: row.production_time ?? "",
    deliveryMethod: row.delivery_method ?? "",
    masterComment: row.master_comment ?? "",
    attachments: [],
  };
}

function normalizeHistory(row: OrderHistoryRow): OrderHistoryEvent {
  return {
    id: row.id,
    event: (row.event_type ?? "заявка создана") as OrderHistoryEvent["event"],
    actor: (row.actor ?? "Система") as OrderHistoryEvent["actor"],
    description: row.description ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export function mapOrderRow(row: OrderRow): Order {
  const productType = row.product_type ?? "Индивидуальное изделие";
  const consent = row.consent_records?.[0];
  const profile = normalizeProfile(row);

  return {
    id: row.id,
    number: `EP-${row.created_at ? new Date(row.created_at).getFullYear() : new Date().getFullYear()}-${row.id.slice(0, 8).toUpperCase()}`,
    client: profile,
    status: (row.status ?? "Новая заявка") as OrderStatus,
    productType,
    approximateSize: row.approximate_size ?? "",
    wishes: row.wishes ?? "",
    budget: row.budget ?? "",
    desiredDeadline: row.desired_deadline ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
    technicalSpecification: normalizeSpecification(row.technical_specifications?.[0], productType),
    consentRecord: consent
      ? {
          confirmedAt: consent.confirmed_at ?? consent.created_at ?? "",
          clientEmail: profile.email,
          clientPhone: profile.phone,
          offerVersion: consent.offer_version ?? "",
          privacyPolicyVersion: consent.privacy_policy_version ?? "",
          ipAddress: consent.ip_address ?? "",
          status: "ТЗ подтверждено клиентом",
        }
      : undefined,
    history: row.order_history?.map(normalizeHistory) ?? [],
  };
}
