// Small glyphs matching the type icons from the Figma "Nueva variable" modal
// (T / T· / $ / calendar / list / circle-dot), rendered in currentColor.
export function VariableTypeIcon({ type, className = 'h-4 w-4' }) {
  switch (type) {
    case 'short_text':
      return (
        <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
          <path d="M5 5h10M10 5v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'long_text':
      return (
        <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 5h12M4 9.5h12M4 14h7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'number':
      return (
        <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
          <path
            d="M8 4 6 16M14 4l-2 12M4 8h13M3.3 13h13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'date':
      return (
        <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
          <rect x="3.5" y="4.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3.5 8.5h13M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'list':
      return (
        <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
          <path
            d="M7 5.5h9M7 10h9M7 14.5h9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="3.6" cy="5.5" r="1" fill="currentColor" />
          <circle cx="3.6" cy="10" r="1" fill="currentColor" />
          <circle cx="3.6" cy="14.5" r="1" fill="currentColor" />
        </svg>
      )
    case 'boolean':
      return (
        <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
          <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="10" cy="10" r="2.2" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}
