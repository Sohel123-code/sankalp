import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { accountType } from '../utils/account'

export default function ProfileMenu() {
  const { user, signOut } = useAuth(), navigate = useNavigate()
  const [open, setOpen] = useState(false), ref = useRef(null), trigger = useRef(null)
  useEffect(() => {
    const outside = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const escape = e => { if (e.key === 'Escape' && open) { setOpen(false); trigger.current?.focus() } }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open])
  if (!user) return null
  const name = user.username || user.name || 'Member', email = user.gmail || user.email
  return <div className="profile-menu" ref={ref} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}>
    <button ref={trigger} className="profile-trigger" id="profile-menu-toggle" aria-expanded={open} aria-haspopup="true" aria-controls="profile-panel" onClick={() => setOpen(v => !v)} aria-label={`Account menu for ${name}`}>
      <span className="profile-avatar" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>
      <svg className="profile-caret" width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4 3 3 3-3" stroke="currentColor" /></svg>
    </button>
    {open && <div className="profile-panel" id="profile-panel">
      <div className="profile-id"><span className="profile-avatar" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span><div><strong>{name}</strong><small>{email || 'Signed in'}</small><em>{accountType(user)}</em></div></div>
      <Link to="/dashboard" onClick={() => setOpen(false)}>My profile</Link>
      <Link to="/registration" onClick={() => setOpen(false)}>Registration & fees</Link>
      <button id="logout-btn" onClick={async () => { await signOut(); navigate('/login', { replace: true }) }}>Sign out</button>
    </div>}
  </div>
}
