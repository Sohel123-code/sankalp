import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import InputField from '../components/InputField'
import ToastContainer from '../components/Toast'
import { useToast, useForm } from '../hooks/useAuth'
import { storeUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

// ─── Brand Panel ───────────────────────────────────────────────────────────
function LoginBrand() {
  return (
    <div className={styles.brandContent}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>S</div>
        <span className={styles.logoText}>Sankalp<em>Events</em></span>
      </div>
      <h1 className={styles.headline}>
        Your Events<br />Await<br />You.
      </h1>
      <p className={styles.brandSub}>
        Sign in to access your events, manage bookings, and connect with the community.
      </p>
      <div className={styles.features}>
        {[
          { icon: '🎯', text: 'Personalized event recommendations' },
          { icon: '🎫', text: 'Instant ticket booking & management' },
          { icon: '🔔', text: 'Real-time event alerts & reminders'  },
        ].map(f => (
          <div key={f.icon} className={styles.featureItem}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Login Form ────────────────────────────────────────────────────────────
export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { signIn } = useAuth()
  const { toasts, toast } = useToast()
  const { values, errors, touched, setValue, setError, touch } = useForm({
    username: '',
    password: '',
  })
  const [loading,   setLoading]   = useState(false)
  const [remember,  setRemember]  = useState(false)
  const [globalMsg, setGlobalMsg] = useState(null)

  // Redirect to origin page after login (or home)
  const from = location.state?.from || '/'

  const validateUsername = (val = values.username) =>
    val.trim() ? '' : 'Username is required.'

  const validatePassword = (val = values.password) =>
    val ? '' : 'Password is required.'

  const handleBlur = (field) => {
    touch(field)
    const v = { username: validateUsername, password: validatePassword }
    setError(field, v[field]())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalMsg(null)

    const errs = { username: validateUsername(), password: validatePassword() }
    Object.entries(errs).forEach(([k, v]) => setError(k, v))
    if (Object.values(errs).some(Boolean)) return

    setLoading(true)
    try {
      const data = await signIn({ username: values.username.trim(), password: values.password })
      storeUser(data.user)
      setGlobalMsg({ text: `Welcome back, ${data.user.username}! Redirecting…`, type: 'success' })
      toast(`Welcome back, ${data.user.username}!`, 'success')
      setTimeout(() => navigate(from, { replace: true }), 1400)
    } catch (err) {
      const msg = err.message || 'Login failed. Please try again.'
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
        reversed
        brandPanel={<LoginBrand />}
        formPanel={
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Welcome back</h2>
              <p>
                Don't have an account?{' '}
                <Link to="/register" id="go-to-register">Sign up</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                id="login-username"
                label="Username"
                type="text"
                icon="user"
                placeholder="Your username"
                autoComplete="username"
                value={values.username}
                onChange={v => { setValue('username', v); if (touched.username) setError('username', validateUsername(v)) }}
                onBlur={() => handleBlur('username')}
                error={touched.username ? errors.username : ''}
                valid={touched.username && !errors.username && !!values.username}
              />

              <InputField
                id="login-password"
                label="Password"
                type="password"
                icon="lock"
                placeholder="Your password"
                autoComplete="current-password"
                value={values.password}
                onChange={v => { setValue('password', v); if (touched.password) setError('password', validatePassword(v)) }}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : ''}
                valid={touched.password && !errors.password && !!values.password}
                labelRight={
                  <button
                    type="button"
                    className={styles.forgotBtn}
                    onClick={() => toast('Password reset coming soon!', 'error')}
                  >
                    Forgot password?
                  </button>
                }
              />

              {/* Remember me */}
              <label className={styles.rememberLabel} htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkmark} aria-hidden="true" />
                Remember me for 7 days
              </label>

              {globalMsg && (
                <div
                  className={`${styles.globalMsg} ${styles[globalMsg.type]}`}
                  role={globalMsg.type === 'error' ? 'alert' : 'status'}
                >
                  {globalMsg.text}
                </div>
              )}

              <button
                type="submit"
                id="loginBtn"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? <><span className={styles.spinner} /> Signing in…</> : 'Sign In'}
              </button>
            </form>

            <div className={styles.divider}><span>Secured by JWT &amp; bcrypt</span></div>
            <p className={styles.footerNote}>Your data is protected with end-to-end encryption.</p>
          </div>
        }
      />
    </>
  )
}
