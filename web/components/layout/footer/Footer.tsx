"use client";

import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/components/providers/i18n";
import { messages } from "@/lib/i18n/messages";

export type FooterLinkKey = keyof typeof messages.en.common.footer;

export interface FooterLink {
  labelKey: FooterLinkKey;
  href: string;
}

export interface FooterProps {
  links?: readonly FooterLink[];
  copyright?: string;
}

export function Footer({ links = [], copyright }: FooterProps) {
  const { locale } = useI18n();
  const translations = messages[locale].common.footer;

  const resolvedCopyright = copyright ?? translations.copyright;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo variant="text" href="/" width={150} />

          {links.length > 0 && (
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      {translations[link.labelKey]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] pt-6">
          <p className="text-sm text-[var(--color-muted)]">
            {resolvedCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
