const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g

function fallbackVariable(key) {
  return { key, label: key, type: 'short_text', required: false }
}

// Splits a template body into an ordered list of text/variable segments,
// e.g. "Hola {{nombre}}!" -> [{type:'text', value:'Hola '}, {type:'variable', key:'nombre', variable}, {type:'text', value:'!'}]
export function parseSegments(body, variables) {
  const byKey = Object.fromEntries(variables.map((v) => [v.key, v]))
  const segments = []
  let lastIndex = 0
  let match

  VARIABLE_PATTERN.lastIndex = 0
  while ((match = VARIABLE_PATTERN.exec(body)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: body.slice(lastIndex, match.index) })
    }
    const key = match[1]
    segments.push({ type: 'variable', key, variable: byKey[key] ?? fallbackVariable(key) })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < body.length) {
    segments.push({ type: 'text', value: body.slice(lastIndex) })
  }
  return segments
}

// Renders a raw form value (or a stored default) according to the variable's type.
export function formatValueForDisplay(variable, rawValue) {
  if (rawValue === undefined || rawValue === null || rawValue === '') return ''
  if (variable.type === 'boolean') {
    return rawValue === true || rawValue === 'true' ? 'Sí' : 'No'
  }
  return String(rawValue).trim()
}

// Replaces every {{key}} with values[key] (or the variable's default), falling back
// to the bracketed label when there's nothing to show yet.
export function fillTemplate(body, variables, values) {
  return parseSegments(body, variables)
    .map((segment) => {
      if (segment.type === 'text') return segment.value
      const { variable } = segment
      const display = formatValueForDisplay(variable, values[segment.key])
      if (display) return display
      const defaultDisplay = formatValueForDisplay(variable, variable.defaultValue)
      return defaultDisplay || `[${variable.label}]`
    })
    .join('')
}

// Replaces the given [start, end) range of `body` with a {{key}} token.
export function insertVariableToken(body, start, end, key) {
  return `${body.slice(0, start)}{{${key}}}${body.slice(end)}`
}

// Returns the variables that still appear in `body`, ordered by first occurrence.
// Used to prune stale variables (e.g. the user manually deleted a {{key}} token)
// and to keep a stable fill-in order for the "use template" form.
export function orderedVariables(body, variables) {
  const byKey = Object.fromEntries(variables.map((v) => [v.key, v]))
  const seen = new Set()
  const result = []
  let match

  VARIABLE_PATTERN.lastIndex = 0
  while ((match = VARIABLE_PATTERN.exec(body)) !== null) {
    const key = match[1]
    if (!seen.has(key)) {
      seen.add(key)
      result.push(byKey[key] ?? fallbackVariable(key))
    }
  }
  return result
}
