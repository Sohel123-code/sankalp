# Local effects supplied by the user

`../LocalEffects.jsx` adapts the effects in:

`effects/E-summit-reverse-engineered-effects-/esummit/`

relative to the workspace root (outside the `sankalp` repository).

| Component | Supplied source | Use |
| --- | --- | --- |
| GravityMesh | `demo-grid.html`, `recovered/app-gravity-bg.component.js` | Home participation section; spring grid, pointer attraction and radial mask |
| CometReveal | `demo-warp.html`, `recovered/app-loading-screen.component.js` | Home workshop transition; thirty curved light streaks revealed by scroll |
| Reactor | `recovered/app-reactor-core.component.js` | About research-to-impact journey; elliptical orbits, spokes, shutters and nucleus |

These are React adaptations, not embedded copies of the reference website.
The comet's original timed canvas sequence becomes a reversible scroll-linked
SVG reveal. Reactor geometry is deterministic, with the same orbit proportions
and orange palette. The gravity mesh retains the 60px grid, 250px attraction
radius, 0.15 spring and 0.65 damping; an idle focus also supports touch devices.

No capture scripts, demo network requests, remote telemetry, bundled Angular
application, or test shims are included. Canvas resolution is capped; resize
observers, pointer listeners and animation frames are cleaned up on unmount.
Gravity and reactor animation pause outside the viewport. Reduced motion
disables continuous movement and preserves readable content.
