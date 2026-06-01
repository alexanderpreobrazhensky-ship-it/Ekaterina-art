"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { currentLegalVersions } from "@/lib/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { PreferredContact } from "@/types";

const productTypes = ["Барельеф", "Зеркало", "Светильник", "Объёмная картина", "Декор для бизнеса"];
const contactMethods: PreferredContact[] = ["Telegram", "WhatsApp", "Телефон", "Email"];

type SubmitState = "idle" | "loading" | "success" | "error";

export function OrderRequestForm({ onCreated }: { onCreated?: () => void }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const supabase = getSupabaseBrowserClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setState("error");
      setMessage("Войдите в личный кабинет, чтобы отправить заявку и сохранить её в Supabase.");
      return;
    }

    const user = userData.user;
    const email = String(formData.get("email") || user.email || "").trim();
    const fullName = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const preferredContact = String(formData.get("contact") || "Email") as PreferredContact;

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      email,
      full_name: fullName,
      phone,
      city,
      preferred_contact: preferredContact,
    });

    if (profileError) {
      setState("error");
      setMessage(profileError.message);
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "Новая заявка",
        product_type: String(formData.get("productType") || "").trim(),
        approximate_size: String(formData.get("size") || "").trim(),
        wishes: String(formData.get("wishes") || "").trim(),
        budget: String(formData.get("budget") || "").trim(),
        desired_deadline: String(formData.get("deadline") || "").trim(),
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setState("error");
      setMessage(orderError?.message ?? "Не удалось создать заявку.");
      return;
    }

    const { error: consentError } = await supabase.from("consent_records").insert({
      order_id: order.id,
      offer_version: currentLegalVersions.offer,
      privacy_policy_version: currentLegalVersions.privacyPolicy,
      confirmed_at: new Date().toISOString(),
    });

    if (consentError) {
      setState("error");
      setMessage(consentError.message);
      return;
    }

    const { error: historyError } = await supabase.from("order_history").insert({
      order_id: order.id,
      event_type: "заявка создана",
      actor: "Клиент",
      description: "Клиент заполнил форму заявки в личном кабинете.",
    });

    if (historyError) {
      setState("error");
      setMessage(historyError.message);
      return;
    }

    form.reset();
    setState("success");
    setMessage("Заявка сохранена в Supabase. Мы свяжемся с вами для уточнения деталей.");
    onCreated?.();
  }

  return (
    <Card className="bg-cream">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-gold">Новая заявка</p>
        <h2 className="mt-2 font-serif text-3xl text-graphite">Расскажите о будущем изделии</h2>
        <p className="mt-2 text-sm leading-6 text-graphite/65">Форма сохраняет профиль, заявку, согласия и историю действий в Supabase.</p>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label>Имя<input name="name" placeholder="Анна" required /></label>
        <label>Телефон<input name="phone" placeholder="+7 999 000-00-00" /></label>
        <label>Email<input name="email" type="email" placeholder="client@example.com" required /></label>
        <label>Город<input name="city" placeholder="Москва" /></label>
        <label>Удобный способ связи<select name="contact">{contactMethods.map((method) => <option key={method}>{method}</option>)}</select></label>
        <label>Вид изделия<select name="productType">{productTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Примерные размеры<input name="size" placeholder="Например, 80 × 120 см" required /></label>
        <label>Бюджет<input name="budget" placeholder="Например, до 100 000 ₽" /></label>
        <label>Желаемый срок<input name="deadline" placeholder="Например, август 2026" /></label>
        <label className="md:col-span-2">Описание пожеланий<textarea name="wishes" rows={5} placeholder="Стиль, цвет, фактура, помещение, важные детали" required /></label>
        <div className="rounded-[1.5rem] border border-dashed border-gold/50 bg-milk p-5 text-sm text-graphite/65 md:col-span-2">
          Загрузка фото/референсов будет подключена к bucket <span className="font-medium">order-files</span> на следующем этапе.
        </div>
        <div className="grid gap-3 text-sm md:col-span-2">
          {["Я согласен(на) с договором-офертой", "Я согласен(на) на обработку персональных данных", "Я понимаю, что изделие изготавливается по индивидуальным параметрам"].map((text) => (
            <label key={text} className="flex items-start gap-3 rounded-2xl bg-milk p-4"><input className="mt-1 h-4 w-4" type="checkbox" required /> <span>{text}</span></label>
          ))}
        </div>
        {message ? <p className={`md:col-span-2 rounded-2xl p-4 text-sm ${state === "error" ? "bg-red-50 text-red-700" : "bg-gold/10 text-graphite/75"}`}>{message}</p> : null}
        <Button className="md:col-span-2 disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={state === "loading"}>{state === "loading" ? "Сохраняем..." : "Отправить заявку"}</Button>
      </form>
    </Card>
  );
}
