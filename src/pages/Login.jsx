import { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { user, loading, authError, signInWithGoogle } = useAuth()
  const [error, setError] = useState()
  const planesRef = useRef(null)

  if (!loading && user) return <Navigate to="/" replace />

  async function handleClick() {
    try {
      setError(undefined)
      await signInWithGoogle()
    } catch {
      setError('No se pudo iniciar sesión. Intenta de nuevo.')
    }
  }

  function scrollToPlanes(e) {
    e.preventDefault()
    planesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-800">
      <div className="pointer-events-none absolute -right-24 -bottom-40 h-[420px] w-[420px] rounded-full bg-brand-500 opacity-25 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[260px] w-[260px] rounded-full bg-brand-500 opacity-40 blur-[70px]" />

      <div className="relative flex min-h-screen flex-col justify-center px-6 py-20 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <p className="text-lg font-bold text-brand-500">Templa</p>

          <h1 className="mt-6 text-4xl leading-[1.15] font-bold text-ink-50 sm:text-5xl">
            Convierte cualquier texto en una plantilla{' '}
            <span className="text-brand-500">{'{editable}'}</span>
          </h1>

          <p className="mt-4 text-base text-ink-400">
            Pega un texto, marca las partes que quieres editar y genera un formulario para
            crear versiones personalizadas en segundos.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleClick}
              className="rounded-full bg-brand-500 px-6 py-2.5 font-semibold text-ink-950 shadow-[0_0_24px_-4px_var(--color-brand-500)] transition hover:brightness-95"
            >
              Empezar
            </button>
            <button
              type="button"
              onClick={scrollToPlanes}
              className="rounded-full border border-brand-500 px-6 py-2.5 font-semibold text-ink-50 transition hover:bg-ink-50/5"
            >
              Ver planes
            </button>
          </div>

          {(error || authError) && <p className="mt-4 text-sm text-red-400">{error || authError}</p>}
        </div>
      </div>

      <div ref={planesRef} className="relative px-6 pb-24 sm:px-12">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-brand-500/30 bg-ink-950/30 p-8">
          <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">
            Plan gratis
          </p>
          <p className="mt-2 text-3xl font-bold text-ink-50">$0</p>
          <ul className="mt-6 flex flex-col gap-3 text-ink-400">
            <li>✓ Hasta 3 plantillas guardadas</li>
            <li>✓ Variables de texto, número, fecha, lista y sí/no</li>
            <li>✓ Envío directo por WhatsApp</li>
          </ul>
          <button
            type="button"
            onClick={handleClick}
            className="mt-8 w-full rounded-full bg-brand-500 px-6 py-2.5 font-semibold text-ink-950 shadow-[0_0_24px_-4px_var(--color-brand-500)] transition hover:brightness-95"
          >
            Empezar gratis
          </button>
        </div>
      </div>
    </div>
  )
}
