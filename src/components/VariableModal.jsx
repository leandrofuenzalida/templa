import { useState } from 'react'
import { VARIABLE_TYPES } from '../lib/variableTypes'
import { VariableTypeIcon } from './VariableTypeIcon'

const EMPTY_OPTION_DRAFT = ''

export function VariableModal({ mode, initial, onCancel, onSave }) {
  const [label, setLabel] = useState(initial.label)
  const [type, setType] = useState(initial.type)
  const [placeholder, setPlaceholder] = useState(initial.placeholder ?? '')
  const [defaultValue, setDefaultValue] = useState(initial.defaultValue ?? '')
  const [required, setRequired] = useState(initial.required ?? false)
  const [options, setOptions] = useState(initial.options ?? [])
  const [optionDraft, setOptionDraft] = useState(EMPTY_OPTION_DRAFT)
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)

  function addOption() {
    const value = optionDraft.trim()
    if (!value || options.includes(value)) return
    setOptions([...options, value])
    setOptionDraft(EMPTY_OPTION_DRAFT)
  }

  function removeOption(value) {
    setOptions(options.filter((o) => o !== value))
    if (defaultValue === value) setDefaultValue('')
  }

  function handleSave() {
    if (!label.trim()) return
    onSave({
      label: label.trim(),
      type,
      placeholder: placeholder.trim(),
      defaultValue: type === 'boolean' ? defaultValue : defaultValue.trim(),
      required,
      ...(type === 'list' ? { options } : {}),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-ink-700 bg-ink-750 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-50">
            {mode === 'edit' ? 'Editar variable' : 'Nueva variable'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-ink-400 hover:text-ink-50"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-400">Nombre de la variable</span>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-ink-50 outline-none focus:border-brand-500"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-400">Tipo de variable</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTypeMenuOpen((v) => !v)}
                className="flex w-full items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-left text-ink-50 focus:border-brand-500"
              >
                <VariableTypeIcon type={type} className="h-4 w-4 text-brand-500" />
                <span className="flex-1">{VARIABLE_TYPES.find((t) => t.id === type)?.label}</span>
                <span className="text-ink-400">▾</span>
              </button>
              {typeMenuOpen && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-ink-600 bg-ink-800 shadow-lg">
                  {VARIABLE_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setType(t.id)
                        setTypeMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-ink-50 hover:bg-ink-700"
                    >
                      <VariableTypeIcon type={t.id} className="h-4 w-4 text-brand-500" />
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-ink-700 pt-4">
            <p className="text-sm font-medium text-ink-400">Opciones adicionales</p>

            {type === 'list' && (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-ink-400">Opciones de la lista</span>
                <div className="flex gap-2">
                  <input
                    value={optionDraft}
                    onChange={(e) => setOptionDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addOption()
                      }
                    }}
                    placeholder="Ej: Tarjeta de crédito"
                    className="flex-1 rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-ink-50 outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={addOption}
                    className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-ink-950 hover:bg-brand-400"
                  >
                    Agregar
                  </button>
                </div>
                {options.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {options.map((o) => (
                      <span
                        key={o}
                        className="flex items-center gap-1.5 rounded-full bg-ink-700 px-3 py-1 text-sm text-ink-50"
                      >
                        {o}
                        <button
                          type="button"
                          onClick={() => removeOption(o)}
                          className="text-ink-400 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-ink-400">Placeholder (opcional)</span>
              <input
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-ink-50 outline-none focus:border-brand-500"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-ink-400">Valor por defecto (opcional)</span>
              {type === 'list' ? (
                <select
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(e.target.value)}
                  className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-ink-50 outline-none focus:border-brand-500"
                >
                  <option value="">Sin valor por defecto</option>
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : type === 'boolean' ? (
                <select
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(e.target.value)}
                  className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-ink-50 outline-none focus:border-brand-500"
                >
                  <option value="">Sin valor por defecto</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input
                  type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-ink-50 outline-none focus:border-brand-500"
                />
              )}
            </label>

            <label className="flex items-center gap-2 text-sm text-ink-50">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="h-4 w-4 accent-brand-500"
              />
              Requerido
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ink-600 px-4 py-2 text-sm text-ink-50 hover:border-ink-400"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-brand-400"
          >
            {mode === 'edit' ? 'Guardar cambios' : 'Guardar variable'}
          </button>
        </div>
      </div>
    </div>
  )
}
