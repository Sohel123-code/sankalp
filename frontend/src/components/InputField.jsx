import { useState } from 'react'
import styles from './InputField.module.css'

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="m2.71 2.71 18.58 18.58"/>
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const ICONS = { user: UserIcon, mail: MailIcon, lock: LockIcon }

/**
 * InputField — reusable form input with icon, error state, and optional password toggle.
 *
 * @param {string}   id
 * @param {string}   label
 * @param {string}   type         — 'text' | 'email' | 'password'
 * @param {string}   icon         — 'user' | 'mail' | 'lock'
 * @param {string}   value
 * @param {Function} onChange
 * @param {Function} onBlur
 * @param {string}   error        — error message to display
 * @param {boolean}  valid        — show valid (green) state
 * @param {string}   placeholder
 * @param {string}   autoComplete
 * @param {React.ReactNode} labelRight  — optional right-side label content (e.g., forgot link)
 */
export default function InputField({
  id,
  label,
  type = 'text',
  icon,
  value,
  onChange,
  onBlur,
  error,
  valid,
  placeholder,
  autoComplete,
  labelRight,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  const Icon = icon ? ICONS[icon] : null

  const inputClass = [
    styles.input,
    error ? styles.invalid : '',
    valid && !error ? styles.valid : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={id}>
        <span>{label}</span>
        {labelRight && <span className={styles.labelRight}>{labelRight}</span>}
      </label>
      <div className={styles.wrap}>
        {Icon && (
          <span className={styles.icon} aria-hidden="true">
            <Icon />
          </span>
        )}
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={inputClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword(s => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {/* BUG FIX: was incorrectly toggling both icons; now conditionally renders one */}
            {showPassword ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
