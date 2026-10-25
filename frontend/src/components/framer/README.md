# Supplied Framer components

**Current integration:** see [REQUESTED_EFFECTS.md](../../../REQUESTED_EFFECTS.md)
for the October 25 Particle, Scroll Zoom, Wave Text, Arc Carousel, Cube Bend and
Infinite Scroll changes. The earlier integration notes below describe previous
revisions. Velarium, LoadScreen, CurvedCarousel and ParticleHoverCard are retained
as source modules but are no longer mounted by the website. Workshops use real
content cards rather than the earlier decorative illustrations. Three.js is now
an optional lazy-loaded dependency for About's tunnel.

These modules come from the component URLs supplied for the SANKALP redesign.
The component implementations and their notices are retained locally, with
Framer editor-only imports replaced by `runtime.js`. Animation uses the npm
`framer-motion` package; no Framer-hosted JavaScript is loaded at runtime.

| Local module | Supplied reference | Placement |
| --- | --- | --- |
| TextHoverEffects.js | https://framer.com/m/TextHoverEffects-cAKHrO.js@GUxzRvJK2MkSks13cqbK | Home headline |
| ScrollRevealText.js | https://framer.com/m/ScrollRevealText-vXBxyx.js@ymLCSaN7wX7cJKeayNed | Home introduction and About |
| AsciiFlowTrail.js | https://framer.com/m/Ascii-FlowTrail-1wMf.js@Yz3XgjaqoKr87S5I6u5z | Workshops introduction |
| WireTerrain.js | https://framer.com/m/Ridgeline-bwTUlY.js@efDqjztibeISXzdZCR6C | Tracks introduction; underlying terrain implementation from the supplied Ridgeline wrapper |
| AnimatedLiquidBackground.js | https://framer.com/m/AnimatedLiquidBackground-Prod-vIhm.js@ghH1aHLmGZ0iE7qXDFVk | Innovation Challenge introduction |

`dependency-*.js` contains the liquid component's original color and shader
dependencies. External module imports were resolved and made relative. Source
map comments pointing to unavailable files were removed. ScrollRevealText
explicitly merges its defaults because React 19 no longer applies function
component `defaultProps`.
The liquid component's optional canvas ref now uses an unconditional `useRef`
call so changing ref props cannot change React hook order.

`Motion.jsx` handles lazy loading, viewport lifetimes, reduced motion, and a
visual fallback if an effect fails. It also implements the curved and torn
section transitions inspired by recordings 2 and 3. Shared CSS implements the
rotating border button from recording 4. The first recording is retained in
`public/media/hero-light-trails.mp4`; the Home hero uses `hero-light-trails-clean.mp4`, with the recorded pointer removed and preview controls cropped out.

## Additional supplied components

| Local module | Supplied reference | Placement |
| --- | --- | --- |
| TextRevealHelper.js | https://framer.com/m/text-reveal-scroll-helper-16vc5F.js@7Bke0DBIx7GpaBFlIp2X | About introduction, reversible word reveal |
| Waveslics.js | https://framer.com/m/Waveslics-26NoBm.js@7l6GCnsmLVGbNI4eQbfK | Programme hero, orange and gold wave slices |
| LoadScreen.jsx | https://framer.com/m/Interactive-Components-Preloader-LoadScreen-j67ejr.js@avLwyyJ0iIdSjc2rmvzz | Route-loading fallback and the complete Home opening curtain |
| DragableCarousel.js | https://framer.com/m/DragableCarousel-ADAPEh.js@fXOJxTG2NAtXIGjIOPmn | Existing Showcase participant cards |
| TypewriterEffect.js | https://framer.com/m/TypewriterEffect-BJ1p.js@1AITomapiVi0hbIN3aB3 | Existing Contact hero subtitle, types once |
| CurvedCarousel.js | https://framer.com/m/CurvedCarousel-6Vfn6S.js@CFLWGhRLCdNq6k2tnwOY | Decorative gallery behind the Speakers hero |
| Velarium.js | https://framer.com/m/Velarium-VRsI38.js@KkrjV9m0xhnrZ0EzMJJe | Home opening, assembling gallery and sheet reveal into existing video hero |

The six code components retain their supplied implementations, with editor imports mapped to the local runtime. LoadScreen is a React/Motion adaptation of the supplied generated Framer component: its five columns and centre-out three-stage reveal are retained without recreating Framer's private variant runtime.

Integration details in `FramerEnhancements.jsx`:

- Heavy components are lazy-loaded. Decorative canvases unmount outside the viewport or when the tab is hidden. Reduced motion uses static artwork, fully visible text, the existing participant grid, and skips the opening.
- Velarium is contained within the Home hero and never locks page scrolling. A five-panel curtain opens fully to reveal the summit name. Its completion starts the original heading entrance from above; the name has a minimum presentation time even if WebGL fails. It runs once per tab, can be skipped by button/Escape/scroll, and releases the hero on unavailable WebGL, component errors, or a bounded timeout. The demo style-picker is disabled. Late texture callbacks and WebGL resources are cleaned up on unmount.
- DraggableCarousel merges its defaults explicitly for React 19, renders the existing card nodes rather than stock photos, supports arrows/keyboard navigation, leaves vertical touch gestures for page scrolling, and cleans up GSAP tweens and listeners. Autoplay is off.
- CurvedCarousel uses four local, code-native SVG illustrations in `public/media/frontiers/`. Its relative asset paths are accepted, template font downloads are disabled, and the decorative instance is excluded from keyboard focus and the accessibility tree.
- TextRevealHelper restores its original DOM during effect cleanup so StrictMode and reduced-motion changes do not nest character spans. TypewriterEffect has a one-time mode and a stable accessible full-text counterpart.
- No dependencies or external runtime script loads were added. Existing summit copy, sections, forms, navigation, API paths, and authentication remain in place.

Run `npm run test:framer` from `frontend/` for scroll reversal, StrictMode cleanup, typewriter completion, carousel keyboard/touch behavior, canvas rendering paths, and the no-WebGL opening fallback. These simulated DOM/canvas checks do not replace visual browser testing.

## Workshop cards

- `ParticleHoverCard.js`: supplied [ParticleHoverCard](https://framer.com/m/ParticleHoverCard-9ISooU.js@qdvXju2YnJldE7En5G1o). Original particle shaders and image transition retained. Editor imports use the local runtime. A decorative mode and controlled hover state let the existing semantic card and details own keyboard interaction. Local artwork replaces demo imagery; density is 4,200 and DPR is capped at 1.25. The wrapper unmounts GPU effects offscreen, on hidden tabs, touch devices, and reduced motion.
- `SwipeCardStack.js`: supplied [Sotnichenko Swipe](https://framer.com/m/Sotnichenko-Swipe-NnQNPP.js@PxsFQTEZtiP8w8bDAVMc). Original spring stack, drag, exit choreography and keyboard handling retained. Text Previous/Next controls replace decorative arrows, Previous navigates backwards, and an index callback keeps the workshop details synchronized. Autoplay and directional links are disabled in this integration.
- `WorkshopCards.jsx` presents all specialist workshops and open labs as cards, with an optional swipe view. Every original description, activity, output, eligibility requirement and registration link remains in native disclosures. Reduced motion always presents the complete grid. No new runtime dependencies or remote image requests are needed.
