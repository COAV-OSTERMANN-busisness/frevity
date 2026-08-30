export default function Home() {
  return (
    <section
      aria-labelledby="landing-title"
      className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <span className="mb-6 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-primary)]">
          Precise. Fast. Reliable.
        </span>

        <h1
          id="landing-title"
          className="max-w-4xl text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl"
        >
          Calculate with confidence.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
          Frevity provides a clear and reliable calculation experience designed
          for precision, speed, and consistency.
        </p>
      </div>
    </section>
  );
}
