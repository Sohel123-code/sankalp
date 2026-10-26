import { Outlet, useLocation } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { PageMotion } from '../components/Motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './MainLayout.module.css'

/**
 * MainLayout — wraps all public/protected pages with Navbar + Footer.
 * Uses React Router's <Outlet /> to render the matched child route.
 */
export default function MainLayout() {
  const { pathname } = useLocation()
  // The bar follows the scroll position directly: a spring would keep the main thread busy for a second after every scroll.
  const { scrollYProgress: scaleX } = useScroll()
  return (
    <div className={`${styles.wrapper} summit-redesign${pathname === '/' ? ' home-curtain' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <motion.div className="reading-progress" style={{ scaleX }} />
      <Navbar key={pathname} />
      <main className={styles.main} id="main-content">
        <PageMotion key={pathname} route={pathname}><Outlet /></PageMotion>
      </main>
      <Footer />
    </div>
  )
}
