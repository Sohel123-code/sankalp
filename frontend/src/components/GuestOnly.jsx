import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  const { state } = useLocation()
  if (loading) return <div className="route-loading"><LoadingSpinner /></div>
  const destination = typeof state?.from === 'string' && state.from.startsWith('/') && !['/login', '/register'].includes(state.from) ? state.from : '/dashboard'
  return user ? <Navigate to={destination} replace /> : children
}
