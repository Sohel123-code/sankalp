/**
 * authService.js
 * Centralised service layer for all authentication API calls.
 * Uses the Vite proxy: /api → http://localhost:3000/api
 */

const API_BASE = '/api'

// ─── Core fetch wrapper ────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      credentials: 'include', // always send/receive httpOnly cookies
      ...options,
    })
  } catch (networkErr) {
    // Network failure (backend offline, DNS error, etc.)
    const err = new Error('Network error — is the backend running?')
    err.status = 0
    throw err
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status  = res.status
    err.data    = data
    throw err
  }

  return data
}

// ─── Auth operations ───────────────────────────────────────────────────────

/** Register a new user — returns { user } */
export async function register({ username, gmail, password }) {
  return apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ username, gmail, password }),
  })
}

/** Login with username + password — sets JWT cookie, returns { user } */
export async function login({ username, password }) {
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

/** Logout — clears the JWT cookie server-side */
export async function logout() {
  return apiFetch('/logout', { method: 'POST' })
}

/** Fetch the currently authenticated user from the JWT cookie */
export async function getMe() {
  return apiFetch('/me')
}

// ─── Local storage helpers ─────────────────────────────────────────────────

/** Store non-sensitive user info in localStorage for UI use */
export function storeUser(user) {
  localStorage.setItem('sk_user', JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem('sk_user')
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('sk_user'))
  } catch {
    return null
  }
}

// ─── Utility helpers ───────────────────────────────────────────────────────

/** Simple email validator */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Password strength — returns { score 0-5, label, color, width } */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'transparent', width: '0%' }
  let score = 0
  if (password.length >= 6)            score++
  if (password.length >= 10)           score++
  if (/[A-Z]/.test(password))          score++
  if (/[0-9]/.test(password))          score++
  if (/[^A-Za-z0-9]/.test(password))  score++

  const levels = [
    { label: '',            color: 'transparent', width: '0%'   },
    { label: 'Very Weak',   color: '#f87171',     width: '20%'  },
    { label: 'Weak',        color: '#fb923c',     width: '40%'  },
    { label: 'Fair',        color: '#facc15',     width: '60%'  },
    { label: 'Strong',      color: '#34d399',     width: '80%'  },
    { label: 'Very Strong', color: '#06b6d4',     width: '100%' },
  ]
  return { score, ...levels[Math.min(score, 5)] }
}
