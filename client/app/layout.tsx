import Footer from "@/components/layouts/Footer";
import MobileNav from "@/components/layouts/MobileNav";
import Navbar from "@/components/layouts/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        <div className="min-h-screen px-3 xl:px-0 pt-[90px] md:pt-[150px] pb-[70px] md:pb-0">
          {children}
          <Footer />
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
