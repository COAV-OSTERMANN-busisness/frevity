"use client";

import {
  FormEvent,
  useState,
} from "react";

interface AdditionalFreightFieldFormProps {
  fieldLabel: string;
  fieldPlaceholder: string;
  addLabel: string;
  onAdd: (label: string) => void;
}

export function AdditionalFreightFieldForm({
  fieldLabel,
  fieldPlaceholder,
  addLabel,
  onAdd,
}: AdditionalFreightFieldFormProps) {
  const [label, setLabel] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    const normalizedLabel = label.trim();

    if (!normalizedLabel) {
      return;
    }

    onAdd(normalizedLabel);
    setLabel("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"
    >
      <label className="block">
        <span
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          {fieldLabel}
        </span>

        <input
          type="text"
          value={label}
          onChange={(event) =>
            setLabel(event.target.value)
          }
          placeholder={fieldPlaceholder}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition"
          style={{ color: "var(--color-text)" }}
        />
      </label>

      <button
        type="submit"
        disabled={!label.trim()}
        className="min-h-11 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: "var(--brand-primary)",
          color: "#ffffff",
        }}
      >
        {addLabel}
      </button>
    </form>
  );
}