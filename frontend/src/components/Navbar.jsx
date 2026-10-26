import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FancyButton } from './Motion'
import ProfileMenu from './ProfileMenu'

const main = [['/','Home'],['/about','About'],['/tracks','Tracks'],['/programme','Programme'],['/workshops','Workshops'],['/contact','Contact']]
const groups = [
  ['Participate', [['/innovation-challenge','Innovation Challenge'],['/investor-connect','Investor Connect'],['/showcase','Research Showcase'],['/partners','Partnerships']]],
  ['Plan your visit', [['/speakers','Speakers'],['/venue','Venue & Travel'],['/registration','Registration & fees'],['/faq','FAQs']]],
]
export default function Navbar() {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(false), [mobile, setMobile] = useState(false)
  const header = useRef(null), trigger = useRef(null), drawer = useRef(null), explore = useRef(null)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)')
    const resize = () => { if (desktop.matches) { setMobile(false); setExpanded(false) } }
    desktop.addEventListener('change', resize)
    return () => desktop.removeEventListener('change', resize)
  }, [])
  useEffect(() => {
    const outside = e => { if (!header.current?.contains(e.target)) setExpanded(false) }
    const keyboard = e => {
      if (e.key === 'Escape') { if (mobile) trigger.current?.focus(); else if (expanded) explore.current?.focus(); setMobile(false); setExpanded(false) }
      if (e.key === 'Tab' && mobile && drawer.current) {
        const focusable = [trigger.current, ...drawer.current.querySelectorAll('a, button')]
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', keyboard)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', keyboard) }
  }, [mobile, expanded])
  useEffect(() => {
    if (!mobile) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    trigger.current?.focus()
    return () => { document.body.style.overflow = previous }
  }, [mobile])
  const logout = async () => { await signOut(); navigate('/login') }
  const links = items => items.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => { setExpanded(false); setMobile(false); if (to === pathname) window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }}>{label}</NavLink>)
  return <header className="site-header" ref={header}>
    <div className="header-shell">
      <Link to="/" className="header-brand" aria-label="SANKALP Andhra 2026 home"><img src="/media/sankalp-logo-640.jpg" width="640" height="320" decoding="async" alt="SANKALP Andhra 2026" /></Link>
      <nav className="header-links" aria-label="Main summit navigation">{links(main)}<button ref={explore} className={expanded ? 'is-open' : ''} onClick={() => setExpanded(v => !v)} aria-expanded={expanded} aria-controls="summit-explore">More <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4 3 3 3-3" stroke="currentColor" /></svg></button></nav>
      <div className="header-cta">{user ? <ProfileMenu /> : loading ? <span className="account-loading" role="status" aria-label="Checking your session" /> : <><Link to="/login" id="nav-login">Sign in</Link><FancyButton to="/register" id="nav-register-cta">Register</FancyButton></>}</div>
      <button ref={trigger} id="mobile-menu-toggle" className="menu-toggle" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} aria-controls="mobile-navigation" onClick={() => { setMobile(v => !v); setExpanded(false) }}><span /><span /></button>
    </div>
    {expanded && <nav className="explore-panel" id="summit-explore" aria-label="More pages">{groups.map(([label,items]) => <div key={label}><span className="tiny-label">{label}</span>{links(items)}</div>)}</nav>}
    {mobile && <div ref={drawer} id="mobile-navigation" className="mobile-panel" role="dialog" aria-label="Mobile navigation"><nav aria-label="Summit pages"><div className="mobile-primary">{links(main)}</div><div className="mobile-secondary">{groups.map(([label,items]) => <div key={label}><span className="tiny-label">{label}</span>{links(items)}</div>)}</div></nav><div className="mobile-account">{user ? <button onClick={logout} id="mobile-logout">Sign out</button> : <><Link to="/login" id="mobile-login">Sign in</Link><Link to="/register" id="mobile-register">Create account</Link></>}</div></div>}
  </header>
}
