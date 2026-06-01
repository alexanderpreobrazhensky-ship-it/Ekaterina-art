import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";


export const metadata: Metadata = {
  title: "Екатерина Преображенская — авторский интерьерный декор",
  description: "Барельефы, зеркала, светильники и объёмные картины по индивидуальному заказу.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
