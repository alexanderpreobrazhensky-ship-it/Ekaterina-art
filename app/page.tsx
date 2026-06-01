import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";

const creations = ["Барельефы", "Зеркала", "Светильники", "Объёмные картины", "Интерьерный декор на заказ"];
const steps = ["Заявка", "Обсуждение", "Техническое задание", "Подтверждение", "Предоплата", "Изготовление", "Передача"];

export default function HomePage() {
  return (
    <>
      <Section className="grid min-h-[70vh] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 text-sm uppercase tracking-[0.32em] text-gold">Авторский декор · ручная работа · согласование заказа</p>
          <h1 className="font-serif text-5xl leading-[0.95] text-graphite sm:text-7xl">Авторский интерьерный декор ручной работы</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-graphite/70">Барельефы, зеркала, светильники и объёмные картины по индивидуальному заказу</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href="/account">Оставить заявку</LinkButton>
            <LinkButton href="/portfolio" variant="secondary">Смотреть портфолио</LinkButton>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[3rem] border border-beige/40 bg-cream shadow-soft">
          <div className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-sand via-milk to-cream" />
          <div className="absolute left-10 top-10 h-44 w-44 rounded-full border border-gold/40" />
          <div className="absolute bottom-10 right-8 h-64 w-40 rounded-full bg-gold/15 blur-sm" />
          <div className="absolute inset-x-10 bottom-10 rounded-[2rem] bg-cream/80 p-6 backdrop-blur">
            <p className="font-serif text-3xl text-graphite">Индивидуальное изделие начинается с точного согласования.</p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Что я создаю" title="Предметы, которые становятся частью архитектуры дома" description="Каждая работа проектируется под помещение, свет, масштаб, цветовую палитру и задачу клиента." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {creations.map((item) => <Card key={item} className="min-h-36"><p className="font-serif text-2xl text-graphite">{item}</p></Card>)}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Как проходит заказ" title="От первой заявки до готового предмета" />
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          {steps.map((step, index) => <Card key={step}><span className="text-sm text-gold">0{index + 1}</span><p className="mt-3 font-medium text-graphite">{step}</p></Card>)}
        </div>
      </Section>

      <Section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeader eyebrow="Почему важно согласование" title="ТЗ защищает ожидания клиента и работу мастера" description="В личном кабинете фиксируются параметры изделия, стоимость, предоплата, сроки, версии оферты и политики персональных данных. Это будущая основа юридически значимого сценария." />
        </Card>
        <Card className="bg-graphite text-cream">
          <p className="font-serif text-4xl">Личный кабинет</p>
          <p className="mt-4 leading-7 text-cream/70">Создайте заявку, отслеживайте статус, проверяйте техническое задание и подтверждайте индивидуальные параметры до запуска изделия в работу.</p>
          <LinkButton href="/account" className="mt-8" variant="secondary">Перейти в личный кабинет</LinkButton>
        </Card>
      </Section>
    </>
  );
}
