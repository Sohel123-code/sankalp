# October 25 component update

Changes are confined to the frontend. Account/session behavior, API routes,
database configuration and Vercel routing are unchanged.

## Current placements

| Supplied component | Placement and local adaptation |
| --- | --- |
| [Particle](https://framer.com/m/Particle-kaOO.js@Vs6pdnnR8ayqgvveq3wk) | Home's first-visit opening. The supplied canvas particle formation samples the local SANKALP text SVG, holds the completed name briefly, then releases the existing video hero. Replaces Velarium and the five-column curtain. |
| [Scroll Zoom Reveal](https://framer.com/m/scroll-zoom-reveal-9JxzBS.js@E6WFj8HQD2DUIudDSkDh) | Workshops introduction. A content-slot port of the sticky expanding aperture, spring scale and delayed text reveal. Summit text replaces the reference's stock photograph/video; it is not an unchanged embed. |
| [Scrolling Wave Text](https://framer.com/m/ScrollingWaveText-SpWNtJ.js@vljySC2CpDLOf2zaXyIY) | Workshops, orange/gold text over charcoal. The original letter-wave, tangent rotation and horizontal scrub are retained. Compact and reduced-motion layouts show a readable text alternative. |
| [Arc Carousel](https://framer.com/m/Arc-Carousel-STPl.js@xg99ZSFiTdUH00xA0XNI) | Tracks. Curved transform origins, wrapped angles and drag snapping display actual track cards in a continuous circular loop. Each settled card holds for three seconds. Bottom-right Stop/Play controls pause and resume autoplay; previous/next and keyboard controls wrap in both directions. Detail panels stay synchronized. No cloned focus targets or demo images. |
| [Cube Bend](https://framer.com/m/CubeBend-lBqkuQ.js@oq8Z64FaRX54r1jH0nQp) | About objectives and Workshop schedule disclosures. Original segmented folds on desktop; a full-list toggle, visible scrollbar and page-scroll chaining remain available. Touch/short/reduced-motion views show ordinary content. Never mounted on Home. |
| [Infinite Scroll](https://framer.com/m/Infinite-scroll-F3bukW.js@RFzWw3xnhlB4MeO81nW3) | About's full-screen research sequence. Original Three.js tunnel geometry and segment recycling follow a shared scroll playhead. Four actual frontier cards approach from depth in order, replacing randomly repeated wall labels. |
| [Text Reveal Helper](https://framer.com/m/text-reveal-scroll-helper-16vc5F.js@7Bke0DBIx7GpaBFlIp2X) | About, the research section, compact Workshop wave fallback and Home closing text. |

The public source modules were inspected before integration. Editor-only Framer
imports use the existing local runtime adapter. No remote Framer code, stock
photos or demo imagery is fetched by these effects. The supplied modules remain
under `src/components/framer`; wrappers are in `RequestedEffects.jsx` and
`FramerEnhancements.jsx`.

## Homepage continuity

Every `SummitSection` after the existing opening story gets a reversible
GSAP entrance, ending fully visible. Heading masks and individual content
panels reveal in sequence while the sections remain in normal document flow.
The opening story's pin is measured first, even when its lazy import finishes
after the chapter triggers. Whole-section exit fades and additional chapter
pins were removed after they could leave the downstream page dark.
Mutation/resize handling rebuilds changed scenes without accumulating timelines.
The footer is outside this animation system.

Hero actions and the scroll prompt were removed as requested. The existing
clean hero video and primary heading remain. All repeated PageHeader breadcrumb
trails were removed. Longer Home track/workshop descriptions are disclosures.

## Performance and accessibility

About's research sequence now has a finite native sticky stage (560svh on
desktop, 460svh on compact screens, including its 100svh stage). A GSAP timeline
reveals AI, quantum, manufacturing and biotech one after another, holds each
card for reading, and drives the tunnel camera from the same progress value.
The last card remains visible as the stage releases to the objectives section.
Reverse scrolling reverses the sequence. No wheel interception, body scroll
lock or generated pin spacer is used. A continue link bypasses the sequence.
Reduced motion and failed animation imports display all four cards in normal
flow. Inactive animated cards are inert and excluded from the accessibility tree.
`npm run test:tunnel` covers ordered depth reveals, reverse frames, background
synchronization, actual scroll past the sequence end, cleanup and reduced motion.

- The particle intro has a 2,200-particle budget, capped device-pixel ratio,
  cancelled image/frame callbacks, completion handoff, Escape/skip controls,
  session suppression and a 4.5-second failure timeout.
- Three.js is lazy-loaded only when About's tunnel is near the viewport on a
  sufficiently large screen without reduced motion. Its approximately 532 kB
  minified chunk (133 kB gzip) is not part of the initial Home download. This
  optional chunk produces Vite's size advisory.
- The tunnel uses nine recycled segments, capped pixel ratio, offscreen/hidden
  tab suspension, and disposes geometries, textures and materials on unmount.
- Wave text suspends outside its viewport range and in hidden tabs.
- Reduced-motion views preserve every content item. Focus makes animated Home
  scenes visible; carousel inactive slides are inert. Vertical touch gestures
  remain available for page scrolling.
- Tracks autoplay pauses offscreen, in hidden tabs, while dragging, and when
  keyboard focus enters a card. User Stop remains in effect until Play is pressed.
  Automatic slide changes are not announced through a live region. The arc uses
  one DOM card per track, and wrapping occurs outside the visible centre with a
  faded outer seam. Timers and motion controls are cancelled on unmount.

## Verification and limits

The production build and UI regression checks cover routes, original programme
filters, workshop tabs, account forms/session behavior, removed hero controls,
breadcrumb removal and track selection. Motion checks exercise actual particle
frames and completion, arc keyboard selection, wave reverse scrolling, folding
content, GSAP scene frames/reverse playback and cleanup.

Browser control currently reports no connected browser and an unavailable native pipe. These
checks are automated DOM/canvas-mock checks, not screenshots or a visual browser
comparison. Actual GPU rendering and visual timing still require browser review;
no pixel-exact match to IIT Bombay's reference is claimed.
