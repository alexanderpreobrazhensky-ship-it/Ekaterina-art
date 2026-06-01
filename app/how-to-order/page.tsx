import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";

const steps = [
  "Клиент оставляет заявку",
  "Обсуждаются размеры, стиль, цвет, фактура",
  "Мастер формирует техническое задание",
  "Клиент подтверждает ТЗ в личном кабинете",
  "Вносится предоплата",
  "Изделие изготавливается",
  "Клиент получает фото готового изделия и доставку/самовывоз",
];

export default function HowToOrderPage() {
  return (
    <Section>
      <SectionHeader eyebrow="Как заказать" title="Прозрачный процесс индивидуального заказа" description="MVP показывает будущую логику оформления, согласования и фиксации решений в личном кабинете." />
      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={step} className="flex items-center gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 font-serif text-xl text-graphite">{index + 1}</span>
            <p className="text-lg text-graphite/80">{step}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
