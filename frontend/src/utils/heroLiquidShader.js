// Original pointer-wake shader, based on the supplied recording's liquid lens
// behavior. No reference-site images, scripts or third-party runtime are used.
export const WAKE_COUNT = 18
export const WAKE_LIFETIME = 1.65
export const liquidVertex = `
attribute vec2 position;
varying vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }
`
export const liquidFragment = `
precision highp float;
varying vec2 uv;
uniform sampler2D videoMap;
uniform sampler2D textMap;
uniform vec2 cover;
uniform float aspect;
uniform float videoOpacity;
uniform float textOpacity;
uniform vec4 wakes[18];

vec3 scene(vec2 p) {
  p = clamp(p, .001, .999);
  vec2 v = (p - .5) * cover + .5;
  vec3 color = texture2D(videoMap, v).rgb * videoOpacity;
  float y = 1. - p.y;
  float shade = y < .23 ? mix(.467, 0., y / .23) :
    y < .6 ? mix(0., .2, (y - .23) / .37) : mix(.2, 1., (y - .6) / .4);
  color = mix(color, y > .6 ? vec3(.031, .031, .027) * ((y - .6) / .4) : vec3(0.), shade);
  vec4 text = texture2D(textMap, p);
  return mix(color, text.rgb, text.a * textOpacity);
}
void main() {
  vec2 offset = vec2(0.);
  float mask = 0.;
  float glint = 0.;
  for (int i = 0; i < 18; i++) {
    vec4 w = wakes[i];
    vec2 delta = (uv - w.xy) * vec2(aspect, 1.);
    float age = w.z;
    float radius = .10 + age * .13;
    float d = length(delta);
    float envelope = exp(-d * d / (radius * radius * .58));
    float life = pow(max(0., 1. - age / 1.65), 2.) * w.w;
    float ripple = sin(d * 105. - age * 14. + sin(delta.x * 41. + delta.y * 29.) * 1.8);
    vec2 radial = delta / max(d, .002);
    vec2 curl = vec2(-radial.y, radial.x);
    offset += (radial * ripple + curl * sin(d * 60. - age * 9.) * .55) * envelope * life * .018;
    mask += envelope * life;
    glint += pow(max(0., ripple), 14.) * envelope * life;
  }
  mask = smoothstep(.015, .30, mask);
  if (mask < .001) { gl_FragColor = vec4(0.); return; }
  offset = clamp(offset, vec2(-.065), vec2(.065)) / vec2(aspect, 1.);
  vec2 p = uv + offset;
  vec3 color = scene(p);
  // Slight dispersion and a warm specular edge make the wake read as liquid.
  color.r = mix(color.r, scene(p + offset * .045).r, .6);
  color.b = mix(color.b, scene(p - offset * .045).b, .6);
  color += vec3(1., .77, .48) * min(glint, 1.5) * .045;
  gl_FragColor = vec4(color, mask);
}
`

export function liquidSize(width, height, dpr = 1) {
  const scale = Math.min(dpr, 1.5, Math.sqrt(1250000 / Math.max(1, width * height)))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)), scale }
}

export function coverScale(width, height, mediaWidth, mediaHeight) {
  const view = width / height, media = mediaWidth / mediaHeight
  return view > media ? [1, media / view] : [view / media, 1]
}

export function packWakes(wakes, now, target = new Float32Array(WAKE_COUNT * 4)) {
  target.fill(0)
  wakes.forEach((wake, index) => {
    if (index >= WAKE_COUNT) return
    target.set([wake.x, wake.y, Math.max(0, now - wake.time), wake.strength], index * 4)
  })
  return target
}
