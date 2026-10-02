import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function FeedbackWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const TYPEFORM_URL = 'https://form.typeform.com/to/T3BVAU5l'

  // Solo mostrar después de login
  if (!user || !TYPEFORM_URL) {
    return null
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-brand-500 p-3 shadow-lg hover:bg-brand-400 transition"
        title="Enviar feedback"
      >
        <span className="text-ink-950 text-xl">💬</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-ink-700 bg-ink-750 overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-700 p-4">
              <h2 className="text-lg font-semibold text-ink-50">Tu feedback nos ayuda a mejorar</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ink-400 hover:text-ink-50"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <iframe
              src={TYPEFORM_URL}
              width="100%"
              height="600"
              frameBorder="0"
              title="Feedback form"
            />
          </div>
        </div>
      )}
    </>
  )
}
