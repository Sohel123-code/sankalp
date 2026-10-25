import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getMe, login, register, logout, storeUser, clearUser, getStoredUser } from '../services/authService'

// ─── Context creation ───────────────────────────────────────────────────────
const AuthContext = createContext(null)

/**
 * AuthProvider — wraps the entire app, provides auth state and actions.
 * 
 * Exposed via useAuth():
 *   user       — current user object or null
 *   loading    — true while initial session is being verified
 *   signIn()   — login(credentials) then sync user state
 *   signOut()  — logout() then clear state
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(getStoredUser)   // hydrate from localStorage
  const [loading, setLoading] = useState(true)
  const sessionVersion = useRef(0)

  // ── Verify JWT cookie on mount ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const version = sessionVersion.current

    async function verifySession() {
      try {
        const data = await getMe()
        if (!cancelled && version === sessionVersion.current) {
          setUser(data.user)
          storeUser(data.user)
        }
      } catch (err) {
        if (!cancelled && version === sessionVersion.current) {
          // Only clear session on explicit 401 (invalid/expired token).
          // Network errors (backend offline) should not log the user out.
          if (err.status === 401) {
            setUser(null)
            clearUser()
          }
          // else: keep the localStorage user as optimistic state
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    verifySession()
    return () => { cancelled = true }
  }, [])

  // ── Sign in ───────────────────────────────────────────────────────────────
  const signIn = useCallback(async (credentials) => {
    const data = await login(credentials)   // throws on error
    sessionVersion.current += 1
    setUser(data.user)
    storeUser(data.user)
    return data
  }, [])

  // Registration already sets the same session cookie as login on the backend.
  const signUp = useCallback(async (credentials) => {
    const data = await register(credentials)
    sessionVersion.current += 1
    setUser(data.user)
    storeUser(data.user)
    return data
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    sessionVersion.current += 1
    try { await logout() } catch { /* ignore network errors */ }
    setUser(null)
    clearUser()
  }, [])

  const value = { user, loading, signIn, signUp, signOut }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/** Custom hook — must be used inside <AuthProvider> */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
