import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

const nav = [
  { href: "/portfolio", label: "Портфолио" },
  { href: "/how-to-order", label: "Как заказать" },
  { href: "/documents", label: "Документы" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-beige/30 bg-milk/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group">
          <span className="block font-serif text-xl text-graphite">Екатерина Преображенская</span>
          <span className="text-xs uppercase tracking-[0.22em] text-graphite/55">interior art handmade</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-graphite/75 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-graphite">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/login" className="text-sm text-graphite/70 transition hover:text-graphite">Войти</Link>
          <LinkButton href="/account" variant="secondary">Личный кабинет</LinkButton>
        </div>
      </div>
    </header>
  );
}
