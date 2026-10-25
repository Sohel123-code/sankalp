import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import InputField from '../components/InputField'
import ToastContainer from '../components/Toast'
import { useToast, useForm } from '../hooks/useAuth'
import { getPasswordStrength, isValidEmail } from '../services/authService'
import styles from './AuthPage.module.css'
import { useAuth } from '../context/AuthContext'

// ─── Brand Panel ───────────────────────────────────────────────────────────
function RegisterBrand() {
  return <div className={styles.brandContent}><Link to="/" aria-label="SANKALP home"><img className="auth-official-logo" src="/media/sankalp-logo.png" alt="SANKALP Andhra 2026" /></Link><h1 className={styles.headline}>Join the<br />conversation.</h1><p className={styles.brandSub}>Research. Technology. Real-world impact.</p><Link className="text-link" to="/">Back to the summit </Link></div>
}

// ─── Register Form ─────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { toasts, toast } = useToast()
  const { values, errors, touched, setValue, setError, touch } = useForm({
    username: '',
    gmail: '',
    password: '',
  })
  const [loading,   setLoading]   = useState(false)
  const [globalMsg, setGlobalMsg] = useState(null)

  const strength = getPasswordStrength(values.password)

  // ── Validators ──────────────────────────────────────────────────────────
  const validateUsername = (val = values.username) => {
    if (!val.trim()) return 'Username is required.'
    if (val.trim().length < 3) return 'Username must be at least 3 characters.'
    if (!/^[a-zA-Z0-9_]+$/.test(val.trim())) return 'Only letters, numbers, and underscores.'
    return ''
  }

  const validateGmail = (val = values.gmail) => {
    if (!val.trim()) return 'Email is required.'
    if (!isValidEmail(val.trim())) return 'Enter a valid email address.'
    return ''
  }

  const validatePassword = (val = values.password) => {
    if (!val) return 'Password is required.'
    if (val.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  const handleBlur = (field) => {
    touch(field)
    const validators = { username: validateUsername, gmail: validateGmail, password: validatePassword }
    setError(field, validators[field]())
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalMsg(null)

    const errs = {
      username: validateUsername(),
      gmail:    validateGmail(),
      password: validatePassword(),
    }
    Object.entries(errs).forEach(([k, v]) => setError(k, v))
    if (Object.values(errs).some(Boolean)) return

    setLoading(true)
    try {
      await signUp({
        username: values.username.trim(),
        gmail:    values.gmail.trim(),
        password: values.password,
      })
      toast('Account created successfully!', 'success')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.'
      setGlobalMsg({ text: msg, type: 'error' })
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} />
      <AuthLayout
        brandPanel={<RegisterBrand />}
        formPanel={
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Create your account</h2>
              <p>
                Already have an account?{' '}
                <Link to="/login" id="go-to-login">Sign in</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                id="username"
                label="Username"
                type="text"
                icon="user"
                placeholder="Choose a username"
                autoComplete="username"
                value={values.username}
                onChange={v => { setValue('username', v); if (touched.username) setError('username', validateUsername(v)) }}
                onBlur={() => handleBlur('username')}
                error={touched.username ? errors.username : ''}
                valid={touched.username && !errors.username && values.username.length >= 3}
              />

              <InputField
                id="gmail"
                label="Email (Gmail)"
                type="email"
                icon="mail"
                placeholder="yourname@gmail.com"
                autoComplete="email"
                value={values.gmail}
                onChange={v => { setValue('gmail', v); if (touched.gmail) setError('gmail', validateGmail(v)) }}
                onBlur={() => handleBlur('gmail')}
                error={touched.gmail ? errors.gmail : ''}
                valid={touched.gmail && !errors.gmail && isValidEmail(values.gmail)}
              />

              <InputField
                id="password"
                label="Password"
                type="password"
                icon="lock"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                value={values.password}
                onChange={v => { setValue('password', v); if (touched.password) setError('password', validatePassword(v)) }}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : ''}
                valid={touched.password && !errors.password && values.password.length >= 6}
              />

              {values.password && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBar}>
                    <div
                      className={styles.strengthFill}
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                  <span className={styles.strengthLabel} style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}

              {globalMsg && (
                <div className={`${styles.globalMsg} ${styles[globalMsg.type]}`} role={globalMsg.type === 'error' ? 'alert' : 'status'}>
                  {globalMsg.text}
                </div>
              )}

              <button
                type="submit"
                id="registerBtn"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? <><span className={styles.spinner} /> Creating account…</> : 'Create Account'}
              </button>
            </form>

            <p className={styles.footerNote}>
              By signing up you agree to our{' '}
              <Link to="/terms">Terms</Link> &amp; <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
        }
      />
    </>
  )
}
