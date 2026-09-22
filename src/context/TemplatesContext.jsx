import { createContext, useContext, useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db, FREE_TEMPLATE_LIMIT } from '../firebase'
import { useAuth } from './AuthContext'
import { DEV_NO_AUTH } from '../lib/devMode'

const TemplatesContext = createContext(null)

const LOCAL_STORAGE_KEY = 'templa_dev_templates'

function loadLocalTemplates() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function saveLocalTemplates(templates) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates))
}

export function TemplatesProvider({ children }) {
  const { user } = useAuth()
  const [templates, setTemplates] = useState(DEV_NO_AUTH ? loadLocalTemplates() : [])
  const [loading, setLoading] = useState(!DEV_NO_AUTH)

  useEffect(() => {
    if (DEV_NO_AUTH) return
    if (!user) {
      setTemplates([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(
      collection(db, 'templates'),
      where('ownerId', '==', user.uid),
      orderBy('updatedAt', 'desc'),
    )
    const unsubscribe = onSnapshot(q, (snap) => {
      setTemplates(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  async function createTemplate({ title, body, variables }) {
    if (DEV_NO_AUTH) {
      if (templates.length >= FREE_TEMPLATE_LIMIT) throw new LimitReachedError()
      const id = `local-${Date.now()}`
      const now = new Date().toISOString()
      const next = [{ id, title, body, variables, createdAt: now, updatedAt: now }, ...templates]
      setTemplates(next)
      saveLocalTemplates(next)
      return id
    }

    if (!user) throw new Error('No hay sesión iniciada')

    // Validate limit on client before creating
    if (templates.length >= FREE_TEMPLATE_LIMIT) {
      throw new LimitReachedError()
    }

    const templateRef = doc(collection(db, 'templates'))

    await runTransaction(db, async (tx) => {
      tx.set(templateRef, {
        ownerId: user.uid,
        title,
        body,
        variables,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    })

    return templateRef.id
  }

  async function updateTemplate(id, { title, body, variables }) {
    if (DEV_NO_AUTH) {
      const next = templates.map((t) =>
        t.id === id ? { ...t, title, body, variables, updatedAt: new Date().toISOString() } : t,
      )
      setTemplates(next)
      saveLocalTemplates(next)
      return
    }

    const templateRef = doc(db, 'templates', id)
    await runTransaction(db, async (tx) => {
      tx.update(templateRef, {
        title,
        body,
        variables,
        updatedAt: serverTimestamp(),
      })
    })
  }

  async function deleteTemplate(id) {
    if (DEV_NO_AUTH) {
      const next = templates.filter((t) => t.id !== id)
      setTemplates(next)
      saveLocalTemplates(next)
      return
    }

    if (!user) throw new Error('No hay sesión iniciada')
    const templateRef = doc(db, 'templates', id)

    await runTransaction(db, async (tx) => {
      tx.delete(templateRef)
    })
  }

  const atLimit = templates.length >= FREE_TEMPLATE_LIMIT

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        loading,
        atLimit,
        limit: FREE_TEMPLATE_LIMIT,
        createTemplate,
        updateTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  )
}

export class LimitReachedError extends Error {
  constructor() {
    super(`Alcanzaste el límite de ${FREE_TEMPLATE_LIMIT} plantillas del plan gratis`)
    this.name = 'LimitReachedError'
  }
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext)
  if (!ctx) throw new Error('useTemplates must be used within TemplatesProvider')
  return ctx
}
