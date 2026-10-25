import { useReducedMotion } from 'framer-motion'

// The supplied components use these Framer editor APIs. The published React
// app needs only the animation code; editor controls are intentionally inert.
export const ControlType = new Proxy({}, { get: (_, key) => key })
export const addPropertyControls = () => {}
export const RenderTarget = { current: () => 'preview', canvas: 'canvas' }
export function useIsStaticRenderer() { return Boolean(useReducedMotion()) }
