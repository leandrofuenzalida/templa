import { parseSegments, formatValueForDisplay } from '../lib/templateParser'

// mode "chips": show each variable as a highlighted {label} chip (editor view).
// mode "values": show the filled-in value, or a dim placeholder while empty (use view).
export function TemplatePreview({ body, variables, values = {}, mode = 'chips' }) {
  const segments = parseSegments(body, variables)

  if (segments.length === 0) {
    return <p className="text-ink-500 italic">El texto va a aparecer acá.</p>
  }

  return (
    <p className="whitespace-pre-wrap leading-relaxed">
      {segments.map((segment, i) => {
        if (segment.type === 'text') return <span key={i}>{segment.value}</span>

        const { variable } = segment

        if (mode === 'chips') {
          return (
            <span
              key={i}
              className="mx-0.5 inline-block rounded-md bg-brand-500/20 px-1.5 py-0.5 text-brand-400 font-medium"
            >
              {`{${variable.label}}`}
            </span>
          )
        }

        const display = formatValueForDisplay(variable, values[segment.key])
        return display ? (
          <span key={i} className="font-medium text-brand-400">
            {display}
          </span>
        ) : (
          <span key={i} className="rounded-md bg-ink-700 px-1.5 py-0.5 text-ink-400">
            {variable.label}
          </span>
        )
      })}
    </p>
  )
}
