import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { accountType } from '../utils/account'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  return <div><PageHeader badge="Your SANKALP account" title={`Welcome, ${user?.username || 'Member'}.`} subtitle="Your account is ready. Explore the summit programme and participation options." breadcrumb={[{label:'My profile'}]} /><div className="section-shell compact-page"><div className="profile-summary"><div><span className="tiny-label">ACCOUNT TYPE</span><strong>{accountType(user)}</strong></div><div><span className="tiny-label">EMAIL</span><strong>{user?.gmail || user?.email || 'Not provided'}</strong></div></div><p className="compact-note">An account does not confirm a summit pass. Participation and booking arrangements will be announced by the organisers.</p><div className="participation-links"><Link to="/programme"><div><h3>Explore the programme</h3><p>Plan your summit experience.</p></div></Link><Link to="/registration"><div><h3>Summit fees</h3><p>Review delegate categories and workshop options.</p></div></Link></div></div></div>
}
