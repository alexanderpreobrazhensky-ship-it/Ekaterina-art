import { LinkButton } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export default function LoginPage() {
  return (
    <Section className="flex min-h-[65vh] items-center justify-center">
      <Card className="w-full max-w-xl">
        <p className="text-sm uppercase tracking-[0.24em] text-gold">Вход клиента</p>
        <h1 className="mt-3 font-serif text-4xl text-graphite">Личный кабинет</h1>
        <p className="mt-3 text-sm leading-6 text-graphite/65">Экран подготовлен под Supabase Auth. Сейчас можно перейти в демо-кабинет без авторизации.</p>
        <form className="mt-6 grid gap-4">
          <label>Email<input type="email" placeholder="client@example.com" /></label>
          <label>Пароль<input type="password" placeholder="••••••••" /></label>
          <Button type="submit">Войти</Button>
        </form>
        <LinkButton href="/account" className="mt-4 w-full" variant="secondary">Открыть демо-кабинет</LinkButton>
      </Card>
    </Section>
  );
}
