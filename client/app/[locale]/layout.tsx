import Footer from "@/components/layouts/Footer";
import MobileNav from "@/components/layouts/MobileNav";
import Navbar from "@/components/layouts/Navbar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ContainerWapper } from "@/components/layouts/Container";
import StoreProvider from "@/lib/redux/StoreProvider";
import { CartDrawer } from "@/components/shared/CartDrawer";
import QueryProvider from "@/lib/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memix",
  description: "Memix - keyfiyyətli moda məhsulları ilə təmin edən, müasir və davamlı geyim həlləri təklif edən etibarlı moda platforması. Ən sevilən brendlərdən 90%-ə qədər endirimlə moda tapıntıları kəşf edin.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <QueryProvider>
              <Navbar />
              <CartDrawer />
              <ContainerWapper className={cn('min-h-screen px-3 xl:px-0 pb-[70px] md:pb-0')}>
                {children}
                <Footer />
              </ContainerWapper>
              <MobileNav />
            </QueryProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
