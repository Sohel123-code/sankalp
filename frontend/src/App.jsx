import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'

// Route guards
import ProtectedRoute from './components/ProtectedRoute'

// Core SANKALP Pages
import Home                 from './pages/Home'
import About                from './pages/About'
import Tracks               from './pages/Tracks'
import Programme            from './pages/Programme'
import Workshops            from './pages/Workshops'
import InnovationChallenge  from './pages/InnovationChallenge'
import InvestorConnect      from './pages/InvestorConnect'
import Speakers             from './pages/Speakers'
import Partners             from './pages/Partners'
import Showcase             from './pages/Showcase'
import Registration         from './pages/Registration'
import Venue                from './pages/Venue'
import FAQ                  from './pages/FAQ'
import Contact              from './pages/Contact'

// Policy Pages
import PrivacyPolicy        from './pages/PrivacyPolicy'
import TermsConditions      from './pages/TermsConditions'
import CancellationRefund   from './pages/CancellationRefund'

// Platform legacy pages
import Events               from './pages/Events'
import EventDetails         from './pages/EventDetails'
import NotFound             from './pages/NotFound'

// Auth pages (standalone)
import Login                from './pages/Login'
import Register             from './pages/Register'

/**
 * ScrollToTop helper ensures every navigation scrolls viewport back to top.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    } else {
      const element = document.getElementById(hash.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* ── Auth routes (standalone — no navbar/footer) ────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Main layout routes (with SANKALP Navbar & Footer) ─────── */}
        <Route element={<MainLayout />}>
          {/* 1. Home */}
          <Route path="/"                       element={<Home />} />

          {/* 2. About the Summit */}
          <Route path="/about"                  element={<About />} />

          {/* 3. Technology Tracks */}
          <Route path="/tracks"                 element={<Tracks />} />

          {/* 4. Programme & Schedule */}
          <Route path="/programme"              element={<Programme />} />

          {/* 5. Workshops & Open Summit Labs */}
          <Route path="/workshops"              element={<Workshops />} />

          {/* 6. SANKALP Innovation Challenge */}
          <Route path="/innovation-challenge"   element={<InnovationChallenge />} />

          {/* 7. Investor & Industry Connect */}
          <Route path="/investor-connect"       element={<InvestorConnect />} />

          {/* 8. Speakers & Experts */}
          <Route path="/speakers"               element={<Speakers />} />

          {/* 9. Partners & Sponsorship */}
          <Route path="/partners"               element={<Partners />} />

          {/* 10. Research & Technology Showcase */}
          <Route path="/showcase"               element={<Showcase />} />

          {/* 11. Registration */}
          <Route path="/registration"           element={<Registration />} />

          {/* 12. Venue & Travel */}
          <Route path="/venue"                  element={<Venue />} />

          {/* 13. FAQs */}
          <Route path="/faq"                    element={<FAQ />} />

          {/* 14. Contact */}
          <Route path="/contact"                element={<Contact />} />

          {/* 15. Privacy Policy */}
          <Route path="/privacy-policy"         element={<PrivacyPolicy />} />

          {/* 16. Terms & Conditions */}
          <Route path="/terms"                  element={<TermsConditions />} />

          {/* 17. Cancellation & Refund Policy */}
          <Route path="/cancellation-refund"    element={<CancellationRefund />} />

          {/* Legacy / platform routes */}
          <Route path="/events"                 element={<Events />} />
          <Route path="/events/:id"             element={<EventDetails />} />

          {/* ── Protected routes ────────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={
              <div style={{ padding: '100px 24px', textAlign: 'center', color: 'var(--clr-text-muted)' }}>
                <h2>🎉 Delegate Dashboard</h2>
                <p style={{ marginTop: '8px' }}>Your confirmed summit passes and workshop credentials will appear here.</p>
              </div>
            } />
          </Route>

          {/* ── 404 Catch-All ───────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
