const FIELD_CLASS =
  "w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-ink-50 outline-none focus:border-brand-500";

// Renders the right input control for a variable's type, shared by the
// "Generar formulario" preview (step 3) and the real "use template" screen.
export function VariableInput({ variable, value, onChange }) {
  const current = value ?? "";

  switch (variable.type) {
    case "long_text":
      return (
        <textarea
          rows={3}
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.placeholder}
          className={FIELD_CLASS}
        />
      );
    case "number":
      return (
        <input
          type="number"
          inputMode="numeric"
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.placeholder}
          className={FIELD_CLASS}
        />
      );
    case "date":
      return (
        <input
          type="date"
          value={current}
          onChange={(e) => onChange(e.target.value)}
          className={FIELD_CLASS}
        />
      );
    case "list":
      return (
        <select
          value={current}
          onChange={(e) => onChange(e.target.value)}
          className={FIELD_CLASS}
        >
          <option value="">Selecciona una opción</option>
          {(variable.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "boolean":
      return (
        <div className="flex gap-2">
          {[
            { value: "true", label: "Sí" },
            { value: "false", label: "No" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={
                "rounded-full border px-4 py-1.5 text-sm font-medium " +
                (current === opt.value
                  ? "border-brand-500 bg-brand-500/20 text-brand-400"
                  : "border-ink-600 text-ink-400 hover:border-ink-400")
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    default:
      return (
        <input
          type="text"
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.placeholder}
          className={FIELD_CLASS}
        />
      );
  }
}
