"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { detectLocale } from "@/lib/i18n/detectLocale";
import { messages } from "@/lib/i18n/messages";
import type { Locale } from "@/types/i18n/types";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function updateMetaContent(selector: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);

  if (element) {
    element.content = content;
  }
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const pathname = usePathname();

  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? detectLocale()
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  useEffect(() => {
    const page = pathname === "/calculator" ? "calculator" : "home";
    const seo = messages[locale].seo[page];

    document.title = seo.title;
    document.documentElement.lang = locale;

    updateMetaContent('meta[name="description"]', seo.description);

    updateMetaContent('meta[property="og:title"]', seo.title);
    updateMetaContent('meta[property="og:description"]', seo.description);

    updateMetaContent('meta[name="twitter:title"]', seo.title);
    updateMetaContent(
      'meta[name="twitter:description"]',
      seo.description
    );
  }, [locale, pathname]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}