import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SUMMIT_INFO } from '../data/sankalpData'
import styles from './Navbar.module.css'

const MAIN_NAV_LINKS = [
  { to: '/',                    label: 'Home' },
  { to: '/about',               label: 'About' },
  { to: '/tracks',              label: 'Tracks' },
  { to: '/programme',           label: 'Programme' },
  { to: '/workshops',           label: 'Workshops & Labs' },
  { to: '/innovation-challenge',label: 'Challenge' },
]

const MORE_LINKS = [
  { to: '/investor-connect', label: 'Investor & Industry Connect', icon: '🤝' },
  { to: '/showcase',         label: 'Research & Tech Showcase',  icon: '🔬' },
  { to: '/speakers',         label: 'Speakers & Experts',        icon: '🎙️' },
  { to: '/partners',         label: 'Partners & Sponsorship',    icon: '🏢' },
  { to: '/venue',            label: 'Venue & Travel',            icon: '📍' },
  { to: '/faq',              label: 'FAQs',                      icon: '❓' },
  { to: '/contact',          label: 'Contact Secretariat',       icon: '✉️' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  // ── Shrink navbar on scroll ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close mobile menu & dropdown on route change ──
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  // ── Close dropdown when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const isMoreActive = MORE_LINKS.some(link => location.pathname === link.to)

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Brand Logo */}
        <Link to="/" className={styles.logo} aria-label={SUMMIT_INFO.name}>
          <span className={styles.logoIcon}>S</span>
          <div className={styles.brandGroup}>
            <span className={styles.logoTitle}>SANKALP <em>2026</em></span>
            <span className={styles.logoSubtitle}>Andhra Tech Summit</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Main summit navigation">
          {MAIN_NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* More Dropdown */}
          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
              type="button"
              className={`${styles.navLink} ${styles.dropdownTrigger} ${
                isMoreActive || dropdownOpen ? styles.active : ''
              }`}
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              More <span className={`${styles.chevron} ${dropdownOpen ? styles.chevronUp : ''}`}>▾</span>
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu} role="menu">
                <div className={styles.dropdownHeader}>Summit Initiatives</div>
                {MORE_LINKS.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    role="menuitem"
                    className={({ isActive }) =>
                      `${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ''}`
                    }
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className={styles.itemIcon}>{icon}</span>
                    <span className={styles.itemLabel}>{label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link
            to="/registration"
            className={`${styles.btnRegister} ${
              location.pathname === '/registration' ? styles.btnRegisterActive : ''
            }`}
            id="nav-register-cta"
          >
            Register Now
          </Link>

          {user ? (
            <div className={styles.userSection}>
              <span className={styles.userGreet} title={user.email}>
                👤 {user.username || 'Delegate'}
              </span>
              <button
                onClick={handleLogout}
                className={styles.btnOutline}
                id="logout-btn"
                title="Sign out of account"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.btnGhost} id="nav-login">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          id="mobile-menu-toggle"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Mobile navigation">
          <div className={styles.mobileNavGroup}>
            <div className={styles.mobileGroupTitle}>Core Summit</div>
            {MAIN_NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className={styles.mobileNavGroup}>
            <div className={styles.mobileGroupTitle}>Initiatives &amp; Details</div>
            {MORE_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.mobileIcon}>{icon}</span> {label}
              </NavLink>
            ))}
          </div>

          <div className={styles.mobileDivider} />

          <div className={styles.mobileActions}>
            <Link
              to="/registration"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileRegisterBtn}
            >
              🎟️ Register for Summit
            </Link>

            {user ? (
              <div className={styles.mobileUserBox}>
                <span className={styles.mobileUserName}>Logged in as {user.username}</span>
                <button
                  onClick={handleLogout}
                  className={styles.mobileLogoutBtn}
                  id="mobile-logout"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className={styles.mobileAuthRow}>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={styles.mobileAuthLink}
                  id="mobile-login"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className={styles.mobileAuthSecondary}
                  id="mobile-register"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
