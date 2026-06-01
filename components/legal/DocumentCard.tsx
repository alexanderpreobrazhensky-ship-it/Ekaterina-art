import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { LegalDocument } from "@/types";

export function DocumentCard({ document }: { document: LegalDocument }) {
  return (
    <Card className="flex h-full flex-col justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{document.version}</p>
        <h3 className="mt-3 font-serif text-2xl text-graphite">{document.title}</h3>
        <p className="mt-3 text-sm leading-6 text-graphite/65">{document.description}</p>
        <p className="mt-4 text-xs text-graphite/45">Обновлено: {new Date(document.updatedAt).toLocaleDateString("ru-RU")}</p>
      </div>
      <LinkButton href={document.href} variant="secondary">Открыть</LinkButton>
    </Card>
  );
}
