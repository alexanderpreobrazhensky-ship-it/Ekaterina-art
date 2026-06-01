import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";

const contacts = [
  ["Мастер", "Екатерина Преображенская"],
  ["Город", "Москва, заказы по России обсуждаются индивидуально"],
  ["Telegram", "@ekaterina_art"],
  ["WhatsApp", "+7 999 000-00-00"],
  ["VK", "vk.com/ekaterina_art"],
  ["Email", "hello@ekaterina-art.ru"],
];

export default function ContactsPage() {
  return (
    <Section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionHeader eyebrow="Контакты" title="Обсудим предмет для вашего интерьера" description="Напишите удобным способом или оставьте сообщение — в будущем форма будет создавать лид в Supabase." />
        <Card className="space-y-4">
          {contacts.map(([label, value]) => <div key={label}><p className="text-xs uppercase tracking-[0.2em] text-gold">{label}</p><p className="mt-1 text-graphite/75">{value}</p></div>)}
        </Card>
      </div>
      <Card>
        <h2 className="font-serif text-3xl text-graphite">Форма обратной связи</h2>
        <form className="mt-6 grid gap-4">
          <label>Имя<input placeholder="Ваше имя" /></label>
          <label>Телефон или email<input placeholder="Как с вами связаться" /></label>
          <label>Сообщение<textarea rows={6} placeholder="Опишите задачу или вопрос" /></label>
          <Button type="submit">Отправить сообщение</Button>
        </form>
      </Card>
    </Section>
  );
}
