import Link from "next/link";

import { Logo } from "@/components/ui/logo/Logo";

export interface HeaderNavigationItem {
  label: string;
  href: string;
}

export interface HeaderAction {
  label: string;
  href: string;
}

export interface HeaderProps {
  navigation: readonly HeaderNavigationItem[];
  primaryAction?: HeaderAction;
  mobileMenuLabel?: string;
}

interface NavigationLinksProps {
  items: readonly HeaderNavigationItem[];
  mobile?: boolean;
}

function NavigationLinks({
  items,
  mobile = false,
}: NavigationLinksProps) {
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            mobile
              ? "rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]"
              : "text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
          }
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

function PrimaryAction({
  action,
  mobile = false,
}: {
  action: HeaderAction;
  mobile?: boolean;
}) {
  return (
    <Link
      href={action.href}
      className={
        mobile
          ? "mt-2 rounded-lg bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          : "rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      }
    >
      {action.label}
    </Link>
  );
}

export function Header({
  navigation,
  primaryAction,
  mobileMenuLabel = "Open navigation menu",
}: HeaderProps) {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo
          variant="icon"
          href="/"
          width={40}
          priority
          className="h-10 w-10 object-contain"
        />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          <NavigationLinks items={navigation} />

          {primaryAction && <PrimaryAction action={primaryAction} />}
        </nav>

        <details className="relative md:hidden">
          <summary
            aria-label={mobileMenuLabel}
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] [&::-webkit-details-marker]:hidden"
          >
            <span className="sr-only">{mobileMenuLabel}</span>

            <span
              className="flex flex-col gap-1.5"
              aria-hidden="true"
            >
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
            </span>
          </summary>

          <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-lg">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col"
            >
              <NavigationLinks items={navigation} mobile />

              {primaryAction && (
                <PrimaryAction
                  action={primaryAction}
                  mobile
                />
              )}
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}