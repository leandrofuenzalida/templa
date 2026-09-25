import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTemplates } from "../context/TemplatesContext";
import { fillTemplate } from "../lib/templateParser";
import { buildWhatsAppLink } from "../lib/whatsapp";
import { TemplatePreview } from "../components/TemplatePreview";
import { VariableInput } from "../components/VariableInput";

export function TemplateUse() {
  const { id } = useParams();
  const { templates, loading } = useTemplates();
  const template = templates.find((t) => t.id === id);

  const [values, setValues] = useState({});
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  if (loading) return <p className="p-10 text-ink-500">Cargando...</p>;

  if (!template) {
    return (
      <div className="p-10 text-ink-500">
        No encontramos esa plantilla.{" "}
        <Link to="/" className="text-brand-400">
          Volver
        </Link>
      </div>
    );
  }

  const variables = template.variables ?? [];
  const message = fillTemplate(template.body, variables, values);
  const missingRequired = variables.filter(
    (v) => v.required && !values[v.key]?.trim(),
  );
  const canSend = missingRequired.length === 0;

  function setValue(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setCopied(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
  }

  function handleSendWhatsApp() {
    window.open(
      buildWhatsAppLink(message, phone),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm font-medium tracking-wide text-brand-400 uppercase">
        Usar plantilla
      </p>
      <h1 className="mb-6 text-3xl font-semibold text-ink-50">
        {template.title}
      </h1>

      {variables.length > 0 && (
        <div className="mb-6 flex flex-col gap-3">
          {variables.map((v) => (
            <label
              key={v.key}
              className="flex flex-col gap-1 text-sm text-ink-400"
            >
              {v.label}
              {v.required && <span className="text-brand-400"> *</span>}
              <VariableInput
                variable={v}
                value={values[v.key]}
                onChange={(val) => setValue(v.key, val)}
              />
            </label>
          ))}
        </div>
      )}

      <div className="mb-6 rounded-lg border border-ink-700 bg-ink-750 p-4">
        <p className="mb-2 text-xs tracking-wide text-ink-500 uppercase">
          Mensaje final
        </p>
        <TemplatePreview
          body={template.body}
          variables={variables}
          values={values}
          mode="values"
        />
      </div>

      <label className="mb-2 flex flex-col gap-1 text-sm text-ink-400">
        Número de WhatsApp (opcional)
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: +56 9 1234 5678"
          className="w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-base text-ink-50 outline-none focus:border-brand-500"
        />
      </label>

      {!canSend && (
        <p className="mb-4 text-sm text-red-400">
          Completa los campos obligatorios (
          {missingRequired.map((v) => v.label).join(", ")}) para copiar o enviar
          el mensaje.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!canSend}
          className="rounded-full border border-ink-600 px-5 py-2 font-medium text-ink-50 hover:border-brand-500 disabled:opacity-40"
        >
          {copied ? "Copiado ✓" : "Copiar"}
        </button>
        <Link
          to={`/templates/${template.id}/edit`}
          className="rounded-full border border-ink-600 px-5 py-2 font-medium text-ink-50 hover:border-brand-500"
        >
          Editar plantilla
        </Link>
        <button
          type="button"
          onClick={handleSendWhatsApp}
          disabled={!canSend}
          className="rounded-full bg-brand-500 px-5 py-2 font-medium text-ink-950 hover:bg-brand-400 disabled:opacity-40"
        >
          Enviar por WhatsApp
        </button>
        <Link to="/" className="ml-auto text-ink-500 hover:text-ink-50">
          Volver
        </Link>
      </div>
    </div>
  );
}
