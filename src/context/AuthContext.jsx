import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'
import { DEV_NO_AUTH } from '../lib/devMode'

const AuthContext = createContext(null)

const DEV_USER = {
  uid: 'dev-user',
  displayName: 'Usuario de prueba',
  email: 'dev@local.test',
}

// Known disposable email domains (mirrored from firestore.rules)
const DISPOSABLE_DOMAINS = [
  '10minutemail.com', '10minutemail.co.uk', '10minutemail.de',
  '24hourmail.com',
  'mailinator.com', 'mailinator.net', 'mailinator.org',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'tempmail.com',
  'temp-mail.org', 'temp-mail.io',
  'throwaway.email',
  'maildrop.cc',
  'grr.la', 'getnada.com',
  '0-mail.com', '0box.eu',
  'emailondeck.com',
  'mytrashmail.com',
  'trashmail.com',
  'fakeinbox.com',
  'sharklasers.com',
  'spam4.me',
  'trashmail.ws',
  'superrito.com',
  'trash-mail.com',
  'maileater.com',
]

function isDisposableEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain && DISPOSABLE_DOMAINS.includes(domain)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEV_NO_AUTH ? DEV_USER : null)
  const [loading, setLoading] = useState(!DEV_NO_AUTH)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (DEV_NO_AUTH) return
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthError(null)
      if (firebaseUser) {
        // Check for disposable email domains
        if (isDisposableEmail(firebaseUser.email)) {
          console.warn('Disposable email domain detected, signing out user:', firebaseUser.email)
          await firebaseSignOut(auth)
          setAuthError('No puedes usar correos temporales o desechables. Usa un correo real de tu proveedor.')
          setUser(null)
          setLoading(false)
          return
        }
        try {
          await ensureUserDoc(firebaseUser)
        } catch (err) {
          console.error('No se pudo crear/leer el documento de usuario en Firestore:', err)
          setAuthError('No se pudo completar el registro. Intenta de nuevo.')
        }
      }
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function ensureUserDoc(firebaseUser) {
    const ref = doc(db, 'users', firebaseUser.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        templateCount: 0,
        createdAt: serverTimestamp(),
      })
    }
  }

  async function signInWithGoogle() {
    if (DEV_NO_AUTH) return
    await signInWithPopup(auth, googleProvider)
  }

  async function signOut() {
    if (DEV_NO_AUTH) return
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
