import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

/**
 * ProtectedRoute — wraps routes that require authentication.
 * While session is loading shows a spinner.
 * If unauthenticated, redirects to /login preserving the original location.
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage />

  if (!user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  return <Outlet />
}
