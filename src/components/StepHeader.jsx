import { useState } from "react";

const STEPS = [
  { n: 1, label: "Pegar texto" },
  { n: 2, label: "Crear variables" },
  { n: 3, label: "Generar formulario" },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M5 10.5 8.5 14 15 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepHeader({ step, onSave, saving }) {
  const [theme, setTheme] = useState("dark");

  return (
    <header className="flex items-center justify-between border-b border-ink-700 bg-ink-900 px-6 py-4">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-brand-500">Templa</span>

        <ol className="hidden items-center gap-2 sm:flex">
          {STEPS.map((s, i) => (
            <li key={s.n} className="flex items-center gap-2">
              {i > 0 && <span className="text-ink-600">—</span>}
              <span
                className={
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold " +
                  (s.n < step
                    ? "bg-brand-500 text-ink-950"
                    : s.n === step
                      ? "bg-brand-500 text-ink-950"
                      : "bg-ink-700 text-ink-400")
                }
              >
                {s.n < step ? <CheckIcon /> : s.n}
              </span>
              <span className={s.n === step ? "text-ink-50" : "text-ink-400"}>
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-50"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px]">
            ?
          </span>
          Ayuda
        </button>
        <button
          type="button"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          className="text-ink-400 hover:text-ink-50"
          aria-label="Cambiar tema"
          title="Modo claro/oscuro (próximamente)"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full border border-brand-500 px-4 py-1.5 text-sm font-medium text-brand-400 hover:bg-brand-500/10 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar plantilla"}
        </button>
      </div>
    </header>
  );
}
