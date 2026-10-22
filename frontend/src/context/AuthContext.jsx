import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe, login, logout, storeUser, clearUser, getStoredUser } from '../services/authService'

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

  // ── Verify JWT cookie on mount ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function verifySession() {
      try {
        const data = await getMe()
        if (!cancelled) {
          setUser(data.user)
          storeUser(data.user)
        }
      } catch (err) {
        if (!cancelled) {
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
    setUser(data.user)
    storeUser(data.user)
    return data
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    try { await logout() } catch { /* ignore network errors */ }
    setUser(null)
    clearUser()
  }, [])

  const value = { user, loading, signIn, signOut }

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
