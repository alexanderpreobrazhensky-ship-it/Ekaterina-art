import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const productTypes = ["Барельеф", "Зеркало", "Светильник", "Объёмная картина", "Декор для бизнеса"];

export function OrderRequestForm() {
  return (
    <Card className="bg-cream">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-gold">Новая заявка</p>
        <h2 className="mt-2 font-serif text-3xl text-graphite">Расскажите о будущем изделии</h2>
        <p className="mt-2 text-sm leading-6 text-graphite/65">Форма подготовлена для будущей записи в Supabase, хранения согласий и загрузки референсов в storage.</p>
      </div>
      <form className="grid gap-4 md:grid-cols-2">
        <label>Имя<input name="name" placeholder="Анна" /></label>
        <label>Телефон<input name="phone" placeholder="+7 999 000-00-00" /></label>
        <label>Email<input name="email" type="email" placeholder="client@example.com" /></label>
        <label>Город<input name="city" placeholder="Москва" /></label>
        <label>Удобный способ связи<select name="contact"><option>Telegram</option><option>WhatsApp</option><option>Телефон</option><option>Email</option></select></label>
        <label>Вид изделия<select name="productType">{productTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Примерные размеры<input name="size" placeholder="Например, 80 × 120 см" /></label>
        <label>Бюджет<input name="budget" placeholder="Например, до 100 000 ₽" /></label>
        <label>Желаемый срок<input name="deadline" placeholder="Например, август 2026" /></label>
        <label className="md:col-span-2">Описание пожеланий<textarea name="wishes" rows={5} placeholder="Стиль, цвет, фактура, помещение, важные детали" /></label>
        <div className="rounded-[1.5rem] border border-dashed border-gold/50 bg-milk p-5 text-sm text-graphite/65 md:col-span-2">
          Загрузка фото/референсов: UI-заглушка. На следующем этапе файлы будут сохраняться в Supabase Storage.
        </div>
        <div className="grid gap-3 text-sm md:col-span-2">
          {["Я согласен(на) с договором-офертой", "Я согласен(на) на обработку персональных данных", "Я понимаю, что изделие изготавливается по индивидуальным параметрам"].map((text) => (
            <label key={text} className="flex items-start gap-3 rounded-2xl bg-milk p-4"><input className="mt-1 h-4 w-4" type="checkbox" required /> <span>{text}</span></label>
          ))}
        </div>
        <Button className="md:col-span-2" type="submit">Отправить заявку</Button>
      </form>
    </Card>
  );
}
