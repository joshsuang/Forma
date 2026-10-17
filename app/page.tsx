export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg text-lg font-semibold tracking-tight"
          style={{
            background: "var(--mark-fill)",
            color: "var(--mark-text)",
          }}
        >
          F
        </div>

        <h1 className="text-3xl font-medium tracking-tight">Forma</h1>
        <p
          className="mt-3 max-w-[18rem] text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          A calm place to track habits. The application foundation is running.
        </p>
      </div>
    </main>
  );
}
