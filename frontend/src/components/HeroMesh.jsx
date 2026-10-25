import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

// Projected wireframe surface: no scene graph, textures, or extra WebGL context.
export default function HeroMesh({ pointerStrength = .35, scale = 1 }) {
  const host = useRef(null), canvas = useRef(null)
  const visible = useInView(host, { amount: .05 }), reduced = useReducedMotion()
  useEffect(() => {
    if (!visible || !canvas.current) return
    const ctx = canvas.current.getContext('2d')
    if (!ctx) return
    const element = host.current, parent = element.closest('.page-intro')
    let frame = 0, last = 0, phase = .4, width = 0, height = 0, tilt = 0, targetTilt = 0
    let pitch = 0, targetPitch = 0
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const draw = () => {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      const mobile = width < 700, radius = scale * Math.min(width * (mobile ? .52 : .32), height * .54)
      const cx = width * (mobile ? .65 : .76), cy = height * .51
      const scroll = Number(element.style.getPropertyValue('--mesh-progress')) || 0
      const project = (latitude, longitude) => {
        const wave = 1 + .13 * Math.sin(longitude * 3 + phase * 2 + scroll * 2) * Math.cos(latitude * 2)
        const x = Math.cos(latitude) * Math.cos(longitude) * wave
        const z = Math.cos(latitude) * Math.sin(longitude) * wave
        const y = Math.sin(latitude) * wave
        const angle = phase * .48 + tilt + scroll * .7, rx = x * Math.cos(angle) - z * Math.sin(angle)
        const rz = x * Math.sin(angle) + z * Math.cos(angle)
        const elevation = .37 + pitch
        const ry = y * Math.cos(elevation) - rz * Math.sin(elevation)
        const depth = y * Math.sin(elevation) + rz * Math.cos(elevation)
        const perspective = 3.5 / (3.5 - depth)
        return [cx + rx * radius * perspective, cy + ry * radius * perspective, depth]
      }
      const line = (fixed, latitudeLine) => {
        ctx.beginPath()
        const steps = mobile ? 42 : 64
        for (let s = 0; s <= steps; s++) {
          const t = s / steps
          const [x, y] = project(latitudeLine ? fixed : -Math.PI / 2 + t * Math.PI, latitudeLine ? t * Math.PI * 2 : fixed)
          if (!s) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.lineWidth = mobile ? .7 : .85
      for (let r = 1; r < 18; r++) {
        ctx.strokeStyle = r % 4 === 0 ? '#ffc96c8c' : '#ff873b4d'
        line(-Math.PI / 2 + r / 18 * Math.PI, true)
      }
      for (let c = 0; c < 26; c++) {
        ctx.strokeStyle = c % 4 === 0 ? '#ffb45085' : '#ff783c38'
        line(c / 26 * Math.PI * 2, false)
      }
    }
    const tick = time => {
      if (document.hidden || reduced) { frame = 0; return }
      if (time - last >= (width < 700 ? 42 : 32)) {
        phase += Math.min((time - (last || time)) / 1000, .05) * .65
        tilt += (targetTilt - tilt) * .055
        pitch += (targetPitch - pitch) * .055
        last = time; draw()
      }
      frame = requestAnimationFrame(tick)
    }
    const resize = () => {
      const box = element.getBoundingClientRect()
      width = box.width; height = box.height
      const dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.25 : 1.5)
      canvas.current.width = Math.round(width * dpr); canvas.current.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw()
    }
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0
      if (!document.hidden && !reduced) frame = requestAnimationFrame(tick)
    }
    const move = e => {
      if (!fine.matches || reduced || e.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      const x = Math.max(-.5, Math.min(.5, (e.clientX - box.left) / Math.max(box.width, 1) - .5))
      const y = Math.max(-.5, Math.min(.5, (e.clientY - box.top) / Math.max(box.height, 1) - .5))
      targetTilt = x * pointerStrength
      targetPitch = y * pointerStrength * .65
    }
    const leave = () => { targetTilt = 0; targetPitch = 0 }
    resize(); visibility()
    const observer = new ResizeObserver(resize); observer.observe(element)
    parent?.addEventListener('pointermove', move, { passive: true })
    parent?.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      cancelAnimationFrame(frame); observer.disconnect()
      parent?.removeEventListener('pointermove', move); parent?.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [visible, reduced, pointerStrength, scale])
  return <div ref={host} className="hero-mesh" aria-hidden="true"><canvas ref={canvas} /></div>
}
