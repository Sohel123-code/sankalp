import { useEffect, useRef } from 'react'
import './HeroLiquid.css'

export default function HeroLiquid({ heroRef, videoRef, enabled }) {
  const canvas = useRef(null)
  useEffect(() => {
    // The refraction follows a mouse. Touch screens have no hover, so they keep the plain video hero and skip the WebGL work.
    if (!enabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let disposed = false, cleanup, timer
    // Let the opening typography finish before measuring its final positions.
    timer = setTimeout(() => {
      import('../utils/heroLiquid').then(({ mountHeroLiquid }) => {
        if (!disposed && heroRef.current && videoRef.current && canvas.current) {
          cleanup = mountHeroLiquid({ canvas: canvas.current, hero: heroRef.current, video: videoRef.current, content: heroRef.current.querySelector('.hero-content') })
        }
      }).catch(() => { /* The original DOM/video hero remains the fallback. */ })
    }, 1300)
    return () => { disposed = true; clearTimeout(timer); cleanup?.() }
  }, [enabled, heroRef, videoRef])
  return <canvas ref={canvas} className="hero-liquid" aria-hidden="true" data-effect="pointer-liquid-refraction" />
}
