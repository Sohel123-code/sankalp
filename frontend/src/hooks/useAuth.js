import { useState, useCallback, useRef } from 'react'

/**
 * useToast — manages a list of toast notifications.
 * Returns { toasts, toast } where toast(msg, type) adds a new toast.
 */
export function useToast() {
  const [toasts, setToasts] = useState([])
  const counterRef = useRef(0)

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++counterRef.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  return { toasts, toast: addToast }
}

/**
 * useForm — lightweight form state + validation manager.
 * @param {object} initialValues
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const setError = useCallback((name, message) => {
    setErrors(prev => ({ ...prev, [name]: message }))
  }, [])

  const clearError = useCallback((name) => {
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const touch = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return { values, errors, touched, setValue, setError, clearError, touch, resetForm }
}
