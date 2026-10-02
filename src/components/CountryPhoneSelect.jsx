import { useState, useMemo, useEffect } from 'react'
import { parsePhoneNumber, isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js'

// Get country flag emoji from country code
function getFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .join('')
}

// Get country name from country code
function getCountryName(countryCode) {
  const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
  try {
    return displayNames.of(countryCode)
  } catch {
    return countryCode
  }
}

export function CountryPhoneSelect({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('US')

  // Detect user's country by IP
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const countryCode = data.country_code?.toUpperCase()
        if (countryCode && getCountries().includes(countryCode)) {
          setSelectedCountry(countryCode)
        }
      })
      .catch(() => {
        // Fallback: keep US as default
      })
  }, [])

  const countries = useMemo(() => {
    return getCountries().map((code) => ({
      code,
      name: getCountryName(code),
      flag: getFlagEmoji(code),
      calling: `+${getCountryCallingCode(code)}`,
    }))
  }, [])

  const filtered = useMemo(() => {
    if (!searchTerm) return countries
    const term = searchTerm.toLowerCase()
    return countries.filter(
      (c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term),
    )
  }, [countries, searchTerm])

  const selected = countries.find((c) => c.code === selectedCountry)

  function handlePhoneChange(e) {
    const phoneOnly = e.target.value.replace(/\D/g, '')
    onChange(`${selected.calling}${phoneOnly}`)
  }

  function handleSelect(code) {
    setSelectedCountry(code)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-ink-400">Número de WhatsApp (opcional)</label>

      <div className="flex gap-2">
        {/* Country Select */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-left text-ink-50 flex items-center gap-2 hover:border-ink-400 min-w-32"
          >
            <span>{selected?.flag}</span>
            <span className="text-sm font-medium">{selected?.calling}</span>
            <span className="text-xs text-ink-400">▾</span>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-ink-800 border border-ink-600 rounded-lg shadow-lg z-50 w-64 flex flex-col">
              <input
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 bg-ink-700 text-ink-50 text-sm border-b border-ink-600 focus:outline-none"
                autoFocus
              />
              <div className="overflow-y-auto max-h-60">
                {filtered.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country.code)}
                    className="w-full px-3 py-2 text-left text-sm text-ink-50 hover:bg-ink-700 flex items-center gap-2"
                  >
                    <span>{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    <span className="text-xs text-ink-400">{country.calling}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <input
          type="tel"
          inputMode="tel"
          value={value.replace(`${selected?.calling}`, '') || ''}
          onChange={handlePhoneChange}
          placeholder="9 1234 5678"
          className="flex-1 rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-base text-ink-50 outline-none focus:border-brand-500"
        />
      </div>

      {/* Validation message */}
      {value && !isValidPhoneNumber(value, selectedCountry) && (
        <p className="text-xs text-red-400">Número de teléfono inválido</p>
      )}
    </div>
  )
}
