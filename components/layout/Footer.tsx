import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-beige/40 bg-graphite text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-2xl">Екатерина Преображенская</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-cream/70">Авторский интерьерный декор ручной работы: от идеи и эскиза до согласованного технического задания и передачи готового изделия.</p>
        </div>
        <div className="text-sm text-cream/70">
          <p className="mb-3 text-cream">Навигация</p>
          <div className="grid gap-2">
            <Link href="/portfolio">Портфолио</Link>
            <Link href="/how-to-order">Как заказать</Link>
            <Link href="/documents">Документы</Link>
            <Link href="/contacts">Контакты</Link>
          </div>
        </div>
        <div className="text-sm text-cream/70">
          <p className="mb-3 text-cream">Для клиента</p>
          <div className="grid gap-2">
            <Link href="/account">Личный кабинет</Link>
            <Link href="/admin">Админка MVP</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
