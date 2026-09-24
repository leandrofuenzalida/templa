import { Link } from "react-router-dom";

export function TemplateCard({ template, onDelete }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-700 bg-ink-900 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-xl text-ink-50">{template.title}</h3>
        <span className="shrink-0 rounded-full bg-ink-800 px-2 py-0.5 text-xs text-ink-500">
          {template.variables?.length ?? 0} var.
        </span>
      </div>
      <p className="line-clamp-3 text-m text-ink-400">{template.body}</p>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => onDelete(template.id)}
          className="mr-auto text-ink-500 hover:text-red-400"
        >
          Eliminar
        </button>

        <Link
          to={`/templates/${template.id}/edit`}
          className="rounded-full border border-ink-600 px-4 py-1.5 text-ink-400 hover:text-ink-50"
        >
          Editar
        </Link>
        <Link
          to={`/templates/${template.id}`}
          className="rounded-full bg-brand-500 px-4 py-1.5 font-medium text-ink-950 hover:bg-brand-400"
        >
          Usar
        </Link>
      </div>
    </div>
  );
}
