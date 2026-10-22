import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './MainLayout.module.css'

/**
 * MainLayout — wraps all public/protected pages with Navbar + Footer.
 * Uses React Router's <Outlet /> to render the matched child route.
 */
export default function MainLayout() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
