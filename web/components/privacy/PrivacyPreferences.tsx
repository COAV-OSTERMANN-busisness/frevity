"use client";

import { usePrivacyConsent } from "./ConsentProvider";

export function PrivacyPreferences() {
  const {
    consent,
    acceptAll,
    acceptEssentialOnly,
  } = usePrivacyConsent();

  return (
    <section aria-labelledby="privacy-preferences-title">
      <h2
        id="privacy-preferences-title"
        className="text-xl font-bold text-[var(--color-text)]"
      >
        Preferências de privacidade
      </h2>

      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Os recursos essenciais permanecem ativos.
        As estatísticas opcionais podem ser ativadas
        ou desativadas a qualquer momento.
      </p>

      <p className="mt-3 text-sm text-[var(--color-text)]">
        Google Analytics:{" "}
        <strong>
          {consent.analytics === "granted"
            ? "Ativado"
            : "Desativado"}
        </strong>
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
          Aceitar Analytics
        </button>
      </div>
    </section>
  );
}