import { coverScale, liquidFragment, liquidSize, liquidVertex, packWakes, WAKE_COUNT, WAKE_LIFETIME } from './heroLiquidShader'

// A transparent, local refractive patch over the existing hero. The DOM stays
// intact and readable, including when WebGL is unavailable or context is lost.
export function mountHeroLiquid({ canvas, hero, video, content }) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, powerPreference: 'low-power' })
  if (!gl) return () => {}
  const textures = [], shaders = []
  let program, buffer, frame = 0, disposed = false, observer
  let bounds, dirty = true, lastPointer = null, lastFrame = 0, wakes = [], opacity = 1
  const textCanvas = document.createElement('canvas'), ctx = textCanvas.getContext('2d')
  const values = new Float32Array(WAKE_COUNT * 4)
  const clear = () => {
    cancelAnimationFrame(frame); frame = 0; wakes = []; lastPointer = null
    if (!gl.isContextLost()) gl.clear(gl.COLOR_BUFFER_BIT)
  }
  const cleanup = () => {
    disposed = true; clear(); observer?.disconnect()
    hero.removeEventListener('pointermove', pointer)
    hero.removeEventListener('pointerleave', leave)
    window.removeEventListener('scroll', invalidate)
    document.removeEventListener('visibilitychange', visibility)
    canvas.removeEventListener('webglcontextlost', lost)
    document.fonts?.removeEventListener('loadingdone', invalidate)
    for (const texture of textures) gl.deleteTexture(texture)
    for (const shader of shaders) gl.deleteShader(shader)
    if (buffer) gl.deleteBuffer(buffer)
    if (program) gl.deleteProgram(program)
  }
  function compile(type, source) {
    const shader = gl.createShader(type); shaders.push(shader)
    gl.shaderSource(shader, source); gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader))
    return shader
  }
  function texture(unit) {
    const value = gl.createTexture(); textures.push(value)
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, value)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return value
  }
  let videoTexture, textTexture, uniforms
  try {
    if (!ctx) throw new Error('Canvas unavailable')
    program = gl.createProgram()
    gl.attachShader(program, compile(gl.VERTEX_SHADER, liquidVertex))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, liquidFragment))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program))
    gl.useProgram(program)
    buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    uniforms = Object.fromEntries(['videoMap', 'textMap', 'cover', 'aspect', 'videoOpacity', 'textOpacity', 'wakes[0]'].map(name => [name, gl.getUniformLocation(program, name)]))
    videoTexture = texture(0); textTexture = texture(1)
    gl.uniform1i(uniforms.videoMap, 0); gl.uniform1i(uniforms.textMap, 1)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.clearColor(0, 0, 0, 0)
  } catch {
    cleanup(); return () => {}
  }

  function captureText() {
    bounds = hero.getBoundingClientRect()
    const size = liquidSize(bounds.width, bounds.height, window.devicePixelRatio)
    canvas.width = textCanvas.width = size.width; canvas.height = textCanvas.height = size.height
    gl.viewport(0, 0, canvas.width, canvas.height)
    ctx.setTransform(size.scale, 0, 0, size.scale, 0, 0)
    // DOM ranges retain actual responsive wrapping, kerning and letter spacing.
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    let node
    while ((node = walker.nextNode())) {
      const style = getComputedStyle(node.parentElement)
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      ctx.fillStyle = style.color; ctx.textBaseline = 'alphabetic'
      const metrics = ctx.measureText('Mg')
      const ascent = metrics.fontBoundingBoxAscent ?? parseFloat(style.fontSize) * .93
      for (let i = 0; i < node.textContent.length; i++) {
        const letter = node.textContent[i]
        if (!letter.trim()) continue
        range.setStart(node, i); range.setEnd(node, i + 1)
        const box = range.getBoundingClientRect()
        if (box.width && box.height) ctx.fillText(letter, box.left - bounds.left, box.top - bounds.top + ascent)
      }
    }
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
    gl.uniform1f(uniforms.aspect, bounds.width / bounds.height)
    gl.uniform1f(uniforms.videoOpacity, Number(getComputedStyle(video).opacity))
    opacity = Number(getComputedStyle(content).opacity)
    gl.uniform1f(uniforms.textOpacity, opacity)
    dirty = false
  }
  function draw(ms) {
    frame = 0
    if (disposed || document.hidden || gl.isContextLost()) return
    const now = ms / 1000
    wakes = wakes.filter(wake => now - wake.time < WAKE_LIFETIME)
    if (!wakes.length) { clear(); return }
    // Cap costly video texture uploads to 40fps. Never animate while idle.
    if (ms - lastFrame >= 25 && video.readyState >= 2) {
      lastFrame = ms
      try {
        if (dirty) captureText()
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, videoTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
        gl.uniform2fv(uniforms.cover, coverScale(bounds.width, bounds.height, video.videoWidth, video.videoHeight))
        gl.uniform4fv(uniforms['wakes[0]'], packWakes(wakes, now, values))
        gl.drawArrays(gl.TRIANGLES, 0, 6)
      } catch { cleanup(); return }
    }
    frame = requestAnimationFrame(draw)
  }
  function pointer(event) {
    if (disposed || document.hidden || event.target.closest('button, a') || video.readyState < 2) return
    // Pointer events are passive: touch scrolling and existing controls still work.
    const box = hero.getBoundingClientRect()
    if (dirty) bounds = box
    const x = (event.clientX - box.left) / box.width, y = 1 - (event.clientY - box.top) / box.height
    const now = performance.now() / 1000
    if (lastPointer) {
      const distance = Math.hypot((x - lastPointer.x) * box.width, (y - lastPointer.y) * box.height)
      if (distance < 9 || now - lastPointer.time < .018) return
      wakes.push({ x, y, time: now, strength: Math.min(1, .35 + distance / 90) })
      if (wakes.length > WAKE_COUNT) wakes.shift()
      if (!frame) frame = requestAnimationFrame(draw)
    } else dirty = true
    lastPointer = { x, y, time: now }
  }
  function leave() { lastPointer = null }
  // Scrolling invalidates the measured text, but an idle overlay has nothing to clear (no GPU work on every scroll event).
  function invalidate() { dirty = true; if (frame || wakes.length) clear() }
  function visibility() { if (document.hidden) clear() }
  function lost(event) { event.preventDefault(); cleanup() }
  observer = new ResizeObserver(invalidate); observer.observe(hero)
  hero.addEventListener('pointermove', pointer, { passive: true })
  hero.addEventListener('pointerleave', leave, { passive: true })
  window.addEventListener('scroll', invalidate, { passive: true })
  document.addEventListener('visibilitychange', visibility)
  document.fonts?.addEventListener('loadingdone', invalidate)
  canvas.addEventListener('webglcontextlost', lost)
  return cleanup
}
