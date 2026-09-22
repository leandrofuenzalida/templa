import { useState } from 'react'
import { VariableTypeIcon } from './VariableTypeIcon'
import { TemplatePreview } from './TemplatePreview'
import { typeLabel } from '../lib/variableTypes'

export function VariablesPanel({ body, variables, onAdd, onEdit, onDelete }) {
  const [showExample, setShowExample] = useState(false)

  const exampleValues = Object.fromEntries(
    variables.map((v) => [v.key, v.placeholder || v.defaultValue || '']),
  )

  return (
    <div className="flex w-full flex-col gap-5 lg:w-80">
      <div className="rounded-lg border border-ink-700 bg-ink-750 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-ink-50">Variables ({variables.length})</h3>
          <button
            type="button"
            onClick={onAdd}
            className="text-sm font-medium text-brand-400 hover:text-brand-300"
          >
            + Añadir variable
          </button>
        </div>

        {variables.length === 0 ? (
          <p className="text-sm text-ink-500">Todavía no creaste ninguna variable.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {variables.map((v) => (
              <li
                key={v.key}
                className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-ink-700/60"
              >
                <VariableTypeIcon type={v.type} className="h-4 w-4 shrink-0 text-brand-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-50">{v.key}</p>
                  <p className="text-xs text-ink-500">{typeLabel(v.type)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit(v)}
                  className="text-ink-400 hover:text-ink-50"
                  aria-label={`Editar ${v.label}`}
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(v.key)}
                  className="text-ink-400 hover:text-red-400"
                  aria-label={`Eliminar ${v.label}`}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-ink-700 bg-ink-750 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-ink-50">Vista previa</h3>
          <button
            type="button"
            onClick={() => setShowExample((v) => !v)}
            className="text-sm font-medium text-brand-400 hover:text-brand-300"
          >
            {showExample ? '↺ Ver plantilla' : '↻ Rellenar ejemplo'}
          </button>
        </div>
        <TemplatePreview
          body={body}
          variables={variables}
          values={showExample ? exampleValues : {}}
          mode="values"
        />
      </div>
    </div>
  )
}
