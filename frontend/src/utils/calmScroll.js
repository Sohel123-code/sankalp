import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// Phones and touch tablets: no pointer to follow, a GPU that is already busy compositing a scrolling page.
export const PHONE_QUERY = '(max-width: 700px), (hover: none) and (pointer: coarse) and (max-width: 1280px)'
export const isPhone = () => typeof window !== 'undefined' && window.matchMedia(PHONE_QUERY).matches

// Scroll-driven reveals (fading, sliding, clipping content as it enters) leave half-hidden content and big
// gaps on a phone, so phones, like reduced-motion users, get the page fully laid out. Touch devices still get a
// light one-shot reveal from utils/touchReveal, which never leaves content hidden.
export function useCalmScroll() {
  const reduced = useReducedMotion()
  const [phone, setPhone] = useState(isPhone)
  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY)
    const update = () => setPhone(query.matches)
    update(); query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return Boolean(reduced) || phone
}
