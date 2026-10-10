import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { I18nProvider } from "@/components/providers/i18n";
import { messages } from "@/lib/i18n/messages";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navigation = [
  {
    labelKey: "home",
    href: "/",
  },
  {
    labelKey: "calculator",
    href: "/calculator",
  },
] as const;

const footerLinks = [
  {
    labelKey: "home",
    href: "/",
  },
  {
    labelKey: "calculator",
    href: "/calculator",
  },
] as const;

const seo = messages.en.seo.home;

export const metadata: Metadata = {
  metadataBase: new URL("https://frevity.app"),

  title: seo.title,

  description: seo.description,

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Frevity",
    title: seo.title,
    description: seo.description,
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: seo.title,
    description: seo.description,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-background)] font-sans text-[var(--color-text)]">
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <Header navigation={navigation} />

            <main className="flex flex-1 flex-col">{children}</main>

            <Footer links={footerLinks} />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}