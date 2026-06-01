import { portfolioItems } from "@/data/portfolioItems";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";

const categories = ["Барельефы", "Зеркала", "Светильники", "Объёмные картины", "Декор для бизнеса"];

export default function PortfolioPage() {
  return (
    <Section>
      <SectionHeader eyebrow="Портфолио" title="Фактура, свет и спокойная палитра" description="Карточки работ пока используют визуальные заглушки, чтобы структура была готова к будущей медиатеке Supabase Storage." />
      <div className="mb-8 flex flex-wrap gap-2">{categories.map((category) => <span key={category} className="rounded-full border border-beige/60 bg-cream px-4 py-2 text-sm text-graphite/70">{category}</span>)}</div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {portfolioItems.map((item) => (
          <Card key={item.id} className="overflow-hidden p-0">
            <div className={`h-56 bg-gradient-to-br ${item.accent} relative`}><div className="absolute inset-8 rounded-[2rem] border border-white/60" /></div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">{item.category}</p>
              <h3 className="mt-3 font-serif text-2xl text-graphite">{item.title}</h3>
              <p className="mt-2 text-sm text-graphite/50">{item.size}</p>
              <p className="mt-4 text-sm leading-6 text-graphite/65">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
