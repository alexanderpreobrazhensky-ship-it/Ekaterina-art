"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type AuthMode = "password" | "magic" | "phone-ready";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("password");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function handleSignUp(form: HTMLFormElement) {
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({ email, password });

    setIsLoading(false);
    setMessage(error ? error.message : "Регистрация создана. Проверьте email, если в Supabase включено подтверждение почты.");
  }

  async function handleMagicLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    setIsLoading(false);
    setMessage(error ? error.message : "Magic link отправлен. Откройте письмо и вернитесь в личный кабинет.");
  }

  return (
    <Section className="flex min-h-[65vh] items-center justify-center">
      <Card className="w-full max-w-xl">
        <p className="text-sm uppercase tracking-[0.24em] text-gold">Вход клиента</p>
        <h1 className="mt-3 font-serif text-4xl text-graphite">Личный кабинет</h1>
        <p className="mt-3 text-sm leading-6 text-graphite/65">Авторизация подключена через Supabase Auth: email + пароль или email + magic link. Телефонный вход подготовлен как отдельный сценарий для будущего SMS/OTP-провайдера.</p>

        <div className="mt-6 grid gap-2 rounded-[1.5rem] bg-milk p-2 sm:grid-cols-3">
          <button className={`rounded-2xl px-4 py-3 text-sm ${mode === "password" ? "bg-cream text-graphite shadow-sm" : "text-graphite/60"}`} onClick={() => setMode("password")} type="button">Email + пароль</button>
          <button className={`rounded-2xl px-4 py-3 text-sm ${mode === "magic" ? "bg-cream text-graphite shadow-sm" : "text-graphite/60"}`} onClick={() => setMode("magic")} type="button">Magic link</button>
          <button className={`rounded-2xl px-4 py-3 text-sm ${mode === "phone-ready" ? "bg-cream text-graphite shadow-sm" : "text-graphite/60"}`} onClick={() => setMode("phone-ready")} type="button">Телефон</button>
        </div>

        {mode === "password" ? (
          <form className="mt-6 grid gap-4" onSubmit={handlePasswordSubmit}>
            <label>Email<input name="email" type="email" placeholder="client@example.com" required /></label>
            <label>Пароль<input name="password" type="password" placeholder="••••••••" minLength={6} required /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="submit" disabled={isLoading}>{isLoading ? "Проверяем..." : "Войти"}</Button>
              <Button type="button" variant="secondary" disabled={isLoading} onClick={(event) => event.currentTarget.form && handleSignUp(event.currentTarget.form)}>Зарегистрироваться</Button>
            </div>
          </form>
        ) : null}

        {mode === "magic" ? (
          <form className="mt-6 grid gap-4" onSubmit={handleMagicLinkSubmit}>
            <label>Email<input name="email" type="email" placeholder="client@example.com" required /></label>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Отправляем..." : "Получить magic link"}</Button>
          </form>
        ) : null}

        {mode === "phone-ready" ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-gold/50 bg-milk p-5 text-sm leading-6 text-graphite/65">
            Архитектура готова: профиль уже хранит поле <span className="font-medium">phone</span>, а сценарий входа вынесен в отдельную вкладку. Для запуска потребуется включить Phone Auth в Supabase, подключить SMS-провайдера и заменить это сообщение на вызов <span className="font-medium">signInWithOtp({`{ phone }`})</span>.
          </div>
        ) : null}

        {message ? <p className="mt-4 rounded-2xl bg-gold/10 p-4 text-sm text-graphite/75">{message}</p> : null}
        <LinkButton href="/account" className="mt-4 w-full" variant="secondary">Перейти в личный кабинет</LinkButton>
      </Card>
    </Section>
  );
}
