import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTemplates, LimitReachedError } from '../context/TemplatesContext'
import { orderedVariables } from '../lib/templateParser'
import { slugify, uniqueKey } from '../lib/slug'
import { StepHeader } from '../components/StepHeader'
import { InlineTemplateEditor } from '../components/InlineTemplateEditor'
import { VariablesPanel } from '../components/VariablesPanel'
import { VariableModal } from '../components/VariableModal'
import { VariableInput } from '../components/VariableInput'
import { TemplatePreview } from '../components/TemplatePreview'

const EMPTY_VARIABLE = {
  label: '',
  type: 'short_text',
  placeholder: '',
  defaultValue: '',
  required: false,
  options: [],
}

export function TemplateWizard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { templates, loading, atLimit, createTemplate, updateTemplate } = useTemplates()
  const isEditing = Boolean(id)
  const existing = isEditing ? templates.find((t) => t.id === id) : null

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [variables, setVariables] = useState([])
  const [hydrated, setHydrated] = useState(!isEditing)
  const [pendingSelection, setPendingSelection] = useState(null)
  const [modalState, setModalState] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState()

  const editorRef = useRef(null)

  useEffect(() => {
    if (isEditing && existing && !hydrated) {
      setTitle(existing.title)
      setBody(existing.body)
      setVariables(existing.variables ?? [])
      setHydrated(true)
    }
  }, [isEditing, existing, hydrated])

  function openCreateFromSelection() {
    setModalState({ mode: 'create' })
  }

  function openAddStandalone() {
    setPendingSelection(null)
    setModalState({ mode: 'create' })
  }

  function openEditVariable(variable) {
    setModalState({ mode: 'edit', variable })
  }

  function handleDeleteVariable(key) {
    setVariables((prev) => prev.filter((v) => v.key !== key))
    setBody((prev) => prev.replaceAll(`{{${key}}}`, ''))
  }

  function handleSaveVariable(data) {
    if (modalState.mode === 'edit') {
      const updated = { ...modalState.variable, ...data }
      setVariables((prev) => prev.map((v) => (v.key === updated.key ? updated : v)))
      setModalState(null)
      return
    }

    const key = uniqueKey(
      slugify(data.label),
      variables.map((v) => v.key),
    )
    const variable = { key, ...data }
    setVariables((prev) => [...prev, variable])

    if (pendingSelection) {
      editorRef.current?.insertChipAtRange(pendingSelection.range, variable)
      setPendingSelection(null)
    } else {
      editorRef.current?.insertChipAtEnd(variable)
    }
    setModalState(null)
  }

  async function handleSaveTemplate() {
    if (!title.trim() || !body.trim()) {
      setError('Completa un nombre y un texto para la plantilla.')
      setStep(1)
      return
    }
    setSaving(true)
    setError(undefined)
    try {
      const finalVariables = orderedVariables(body, variables)
      if (isEditing) {
        await updateTemplate(id, { title: title.trim(), body, variables: finalVariables })
      } else {
        await createTemplate({ title: title.trim(), body, variables: finalVariables })
      }
      navigate('/')
    } catch (err) {
      console.error('Error al guardar la plantilla:', err)
      setError(
        err instanceof LimitReachedError ? err.message : 'No se pudo guardar la plantilla.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (isEditing && loading) {
    return <p className="p-10 text-ink-500">Cargando...</p>
  }

  if (isEditing && !existing) {
    return (
      <div className="p-10 text-ink-500">
        No encontramos esa plantilla.{' '}
        <Link to="/" className="text-brand-400">
          Volver
        </Link>
      </div>
    )
  }

  if (!isEditing && atLimit) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-ink-50">Límite de plan gratis alcanzado</h1>
        <p className="mt-2 text-ink-500">
          Ya tienes 3 plantillas guardadas. Elimina una para crear otra.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-brand-500 px-5 py-2 font-medium text-ink-950 hover:bg-brand-400"
        >
          Volver a mis plantillas
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <StepHeader step={step} onSave={handleSaveTemplate} saving={saving} />

      {error && (
        <p className="border-b border-ink-700 bg-red-500/10 px-6 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mx-auto max-w-5xl px-6 py-8">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-ink-50">Pega el texto de tu plantilla</h1>
              <p className="text-ink-500">
                Copia el mensaje que usas siempre. En el próximo paso vas a poder marcar las
                partes que cambian como variables.
              </p>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre de la plantilla"
              className="rounded-lg border border-ink-600 bg-ink-800 px-4 py-2.5 text-ink-50 outline-none focus:border-brand-500"
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              placeholder="Pega acá el mensaje que quieres convertir en plantilla..."
              className="resize-y rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 leading-relaxed text-ink-50 outline-none focus:border-brand-500"
            />

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!title.trim() || !body.trim()}
                className="rounded-full bg-brand-500 px-5 py-2 font-medium text-ink-950 hover:bg-brand-400 disabled:opacity-50"
              >
                Continuar al paso 2 →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-ink-50">Editor de plantilla</h1>
                <p className="text-ink-500">
                  Selecciona cualquier palabra o frase para convertirla en una variable.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-ink-750 px-3 py-1 text-sm text-brand-400">
                {variables.length} {variables.length === 1 ? 'variable creada' : 'variables creadas'}
              </span>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <InlineTemplateEditor
                  ref={editorRef}
                  body={body}
                  variables={variables}
                  onChange={setBody}
                  onSelectText={setPendingSelection}
                  onEscape={() => setPendingSelection(null)}
                  placeholder="Pega o escribe el texto de tu plantilla..."
                />

                {pendingSelection ? (
                  <div className="flex items-center justify-between rounded-lg border border-brand-800/60 bg-brand-500/10 px-4 py-2">
                    <span className="truncate text-sm text-ink-400">
                      Seleccionado: <span className="text-brand-400">"{pendingSelection.text}"</span>
                    </span>
                    <button
                      type="button"
                      onClick={openCreateFromSelection}
                      className="ml-3 shrink-0 rounded-full bg-brand-500 px-4 py-1.5 text-sm font-medium text-ink-950 hover:bg-brand-400"
                    >
                      Convertir en variable
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-ink-500">
                    💡 Selecciona texto para crear una variable · Esc para cancelar selección
                  </p>
                )}
              </div>

              <VariablesPanel
                body={body}
                variables={variables}
                onAdd={openAddStandalone}
                onEdit={openEditVariable}
                onDelete={handleDeleteVariable}
              />
            </div>

            <div className="mt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-ink-400 hover:text-ink-50"
              >
                ← Volver al paso anterior
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-full bg-brand-500 px-5 py-2 font-medium text-ink-950 hover:bg-brand-400"
              >
                Continuar al paso 3 →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-ink-50">Formulario generado</h1>
              <p className="text-ink-500">
                Así se va a ver el formulario para completar esta plantilla.
              </p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex flex-1 flex-col gap-4 rounded-lg border border-ink-700 bg-ink-750 p-5">
                {variables.length === 0 ? (
                  <p className="text-ink-500">
                    Esta plantilla todavía no tiene variables para completar.
                  </p>
                ) : (
                  variables.map((v) => (
                    <label key={v.key} className="flex flex-col gap-1.5 text-sm text-ink-400">
                      {v.label}
                      {v.required && <span className="text-brand-400"> *</span>}
                      <VariableInput variable={v} onChange={() => {}} />
                    </label>
                  ))
                )}
              </div>

              <div className="flex-1 rounded-lg border border-ink-700 bg-ink-750 p-5">
                <p className="mb-2 text-xs tracking-wide text-ink-500 uppercase">
                  Mensaje de ejemplo
                </p>
                <TemplatePreview
                  body={body}
                  variables={variables}
                  values={Object.fromEntries(variables.map((v) => [v.key, v.placeholder || v.defaultValue || '']))}
                  mode="values"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-ink-400 hover:text-ink-50"
              >
                ← Volver al paso anterior
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                disabled={saving}
                className="rounded-full bg-brand-500 px-5 py-2 font-medium text-ink-950 hover:bg-brand-400 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar plantilla'}
              </button>
            </div>
          </div>
        )}
      </div>

      {modalState && (
        <VariableModal
          mode={modalState.mode}
          initial={
            modalState.mode === 'edit'
              ? modalState.variable
              : { ...EMPTY_VARIABLE, label: pendingSelection?.text.trim().slice(0, 40) ?? '' }
          }
          onCancel={() => setModalState(null)}
          onSave={handleSaveVariable}
        />
      )}
    </div>
  )
}
