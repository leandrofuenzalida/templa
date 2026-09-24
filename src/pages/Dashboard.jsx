import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTemplates } from "../context/TemplatesContext";
import { TemplateCard } from "../components/TemplateCard";

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { templates, loading, atLimit, limit, deleteTemplate } = useTemplates();

  async function handleDelete(id) {
    if (confirm("¿Eliminar esta plantilla?")) {
      await deleteTemplate(id);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-brand-400 uppercase">
            Templa
          </p>
          <h1 className="text-3xl font-semibold text-ink-50">Tus plantillas</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-500">{user?.displayName}</span>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-ink-600 px-3 py-1.5 text-sm text-ink-500 hover:text-ink-50"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-m text-ink-400">
          {templates.length}/{limit} plantillas usadas (plan gratis)
        </span>
        {atLimit ? (
          <span
            title={`Alcanzaste el límite de ${limit} plantillas del plan gratis`}
            className="rounded-full bg-ink-800 px-4 py-2 text-sm text-ink-500"
          >
            Límite alcanzado
          </span>
        ) : (
          <Link
            to="/templates/new"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-brand-400 text-center whitespace-nowrap"
          >
            + Nueva plantilla
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-ink-500">Cargando...</p>
      ) : templates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-700 p-10 text-center text-ink-500">
          Todavía no has creado ninguna plantilla. Pega un texto y marca las
          partes que cambian como variables.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
