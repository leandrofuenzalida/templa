export const VARIABLE_TYPES = [
  { id: 'short_text', label: 'Texto corto' },
  { id: 'long_text', label: 'Texto largo' },
  { id: 'number', label: 'Número' },
  { id: 'date', label: 'Fecha' },
  { id: 'list', label: 'Lista (opciones)' },
  { id: 'boolean', label: 'Sí / No' },
]

export function typeLabel(typeId) {
  return VARIABLE_TYPES.find((t) => t.id === typeId)?.label ?? typeId
}
