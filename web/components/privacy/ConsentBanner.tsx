"use client";

import { usePrivacyConsent } from "./ConsentProvider";

export function ConsentBanner() {
  const {
    consent,
    acceptAll,
    acceptEssentialOnly,
  } = usePrivacyConsent();

  if (consent.analytics !== "pending") {
    return null;
  }

  return (
    <section
      aria-label="Preferências de privacidade"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl"
    >
      <h2 className="text-lg font-bold text-[var(--color-text)]">
        Privacidade no Frevity
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        Utilizamos recursos essenciais para o funcionamento
        do Frevity. Com sua autorização, também poderemos
        utilizar o Google Analytics para compreender o uso
        da ferramenta. Você pode continuar utilizando a
        calculadora sem aceitar as estatísticas opcionais.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={acceptEssentialOnly}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
        >
          Apenas essenciais
        </button>

        <button
          type="button"
          onClick={acceptAll}
          className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          Aceitar todos
        </button>
      </div>
    </section>
  );
}