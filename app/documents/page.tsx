import { DocumentCard } from "@/components/legal/DocumentCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { legalDocuments } from "@/data/legalDocuments";

export default function DocumentsPage() {
  return (
    <Section>
      <SectionHeader eyebrow="Документы" title="Юридическая основа индивидуального заказа" description="Карточки документов содержат версии, которые затем будут фиксироваться при согласовании ТЗ и храниться в базе данных." />
      <div className="grid gap-6 md:grid-cols-2">
        {legalDocuments.map((document) => <DocumentCard key={document.id} document={document} />)}
      </div>
    </Section>
  );
}
