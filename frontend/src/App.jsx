import { lazy, Suspense, useEffect } from 'react'
import LoadingSpinner from './components/LoadingSpinner'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'

// Route guards
import ProtectedRoute from './components/ProtectedRoute'
import GuestOnly from './components/GuestOnly'
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Core SANKALP Pages
import Home                 from './pages/Home'
const About = lazy(() => import('./pages/About'))
const Tracks = lazy(() => import('./pages/Tracks'))
const Programme = lazy(() => import('./pages/Programme'))
const Workshops = lazy(() => import('./pages/Workshops'))
const InnovationChallenge = lazy(() => import('./pages/InnovationChallenge'))
const InvestorConnect = lazy(() => import('./pages/InvestorConnect'))
const Speakers = lazy(() => import('./pages/Speakers'))
const Partners = lazy(() => import('./pages/Partners'))
const Showcase = lazy(() => import('./pages/Showcase'))
const Registration = lazy(() => import('./pages/Registration'))
const Venue = lazy(() => import('./pages/Venue'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))

// Policy Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const CancellationRefund = lazy(() => import('./pages/CancellationRefund'))

// Platform legacy pages
const Events = lazy(() => import('./pages/Events'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Auth pages (standalone)
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

/**
 * ScrollToTop helper ensures every navigation scrolls viewport back to top.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      // Route entrances begin at the top immediately; CSS smooth scrolling must
      // not carry the previous page's scroll position into the new hero.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } else {
      const scrollToAnchor = () => {
        const element = document.getElementById(hash.slice(1))
        if (!element) return false
        element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
        return true
      }
      if (scrollToAnchor()) return
      // Route chunks may finish loading after this effect first runs.
      const observer = new MutationObserver(() => { if (scrollToAnchor()) observer.disconnect() })
      observer.observe(document.getElementById('root'), { childList: true, subtree: true })
      return () => observer.disconnect()
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Suspense fallback={<div className="route-loading"><LoadingSpinner /></div>}>
      <Routes>
        {/* ── Auth routes (standalone — no navbar/footer) ────────────── */}
        <Route path="/login"    element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

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
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* ── 404 Catch-All ───────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </AuthProvider>
  )
}
