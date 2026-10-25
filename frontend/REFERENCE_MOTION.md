# Reference inspection and implementation

Current content refinement: abstract illustration cards and the story progress
line have been removed at the user's request. Cards now show actual track topics,
workshop outputs, locations and times. The geometric story object is replaced by
a summit overview; the existing timed fact transitions remain. The speakers image
gallery and unverified legacy event covers are removed. The opening retains its
curtain/name/video sequence but uses only the supplied hero poster in its slides.
The recording analysis below is historical evidence, not a claim that those
abstract visuals are still used in the current UI.

Reference: https://www.ecell.in/esummit/ . Inspected 24 October 2026.
Content authority: the supplied SANKALP website content master document.
The homepage Hero function, media, opening sequence and hero CSS are preserved.

## Evidence and limits

The supplied `Screen Recording 2026-10-24 190649.mp4` contains 465 frames at
30 fps (15.5 seconds, 1918 × 966). A 16-frame contact sheet was inspected.
The recording is the visual authority for this implementation:

| Recording time | Observed behaviour | SANKALP treatment |
| --- | --- | --- |
| 0–3 s | Orange horizon above a large media panel, surrounded by black space | Existing home hero retained; original technology artwork introduces the next scene |
| 3–6 s | Media disappears into black, then a smaller multi-panel composition recedes | Scroll-linked scale, opacity and vertical translation on an original technology composition |
| 7–10 s | Orange wireframe object at left; text/statistic changes at right | Original projected wireframe and four SANKALP facts in a desktop pinned sequence |
| 10–11 s | Large orange heading emerges into the next section | Masked word reveal followed by content reveal |
| 12–15 s | Dark, thin-bordered event cards appear in staggered rows | Staggered track, workshop and participation cards with restrained orange accents |

These are playback timestamps, not measured animation durations: the recording
does not expose scroll position or input speed. Exact easing and scrub constants
cannot be established from it. The implementation uses explicitly chosen GSAP
ScrollTrigger timings and native scrolling as an approximation.

Live browser inspection failed because both available browser/Windows runtimes
reported `failed to start Node runtime`. The text web tool returned a JavaScript
shell for the homepage and the relevant `/ttmm`, `/agenda`, `/livinglab`,
`/entremun`, `/expo` and `/workshops` pages. Indexed official content confirms
event cards, timeline steps, day filters and FAQs, but cannot establish motion.
Direct public HTML retrieval returned HTTP 403; no access controls were bypassed.
As a result, network traffic, JS/CSS bundle URLs, font files, hover/cursor effects,
initial load, route transitions and responsive choreography could not be verified.

The official https://github.com/ecell-iitb/ organisation and targeted public
repository searches did not identify a matching public E-Summit source repo.
This does not establish that none exists. No reference code, photos, event logos,
speaker portraits or fonts with unknown reuse rights were copied.

## Design and technical decisions

- Keep SANKALP content, orange/gold branding, local technology illustrations and
  existing Inter/Manrope typography. Do not import reference event claims.
- Use GSAP and ScrollTrigger already in the project; no smooth-scroll replacement,
  wheel interception, custom cursor, extra WebGL context or new dependency.
- Desktop: one explicit pinned introduction, then native scrolling with scrubbed
  reveal/hold timing. Long sections and forms are never pinned or faded away.
- Mobile: normal stacked flow, shorter movements, no pinned story.
- Reduced motion: all content immediately visible, no pinning or animation.
- Focused content is visible. Animation failure leaves readable content. Route
  cleanup releases observers, triggers and animation styles.

## Verification

- Production Vite build passed. The homepage body loads in a separate chunk to
  reduce work on the initial hero load; GSAP sequences are also lazy-loaded.
- `test:ui`: 21 public/auth routes, account flows, programme days and filters,
  track search, workshop disclosures/tabs, fee calculator and mobile menu passed.
- `test:scroll`, `test:cinematic`, `test:framer`: existing motion, reduced-motion,
  hero/opening and supplied component checks passed.
- `test:reference`: real GSAP animation frames checked at hidden/intermediate/
  revealed positions and in reverse; all four story panels checked; dynamic card
  additions have one animation owner; desktop pin and spacer clean up; mobile
  gets unpinned reveals; reduced motion creates no timelines. Hero and forms
  are excluded. A mutation-observer/GSAP measurement interaction found by this
  test was corrected.
- The existing homepage `Hero` function was hash-compared before/after and is
  byte-identical. Its media and opening component were not edited in this revision.

These are DOM, interaction and animation-engine tests, not real-browser visual
or frame-rate measurements. Browser visual comparison is unavailable in this
environment; no claim is made of pixel fidelity, exact reference timing, verified
mobile rendering, or a full live-site inspection. A live comparison remains needed
when the browser tools are available.
# October 25 update

The current implementation and verification notes are in
[REQUESTED_EFFECTS.md](./REQUESTED_EFFECTS.md). It extends the lower homepage
chapters with reversible reveal/hold/exit timelines and replaces the earlier
homepage curtain with particle formation, as subsequently requested. Statements
below about a byte-identical hero refer to the earlier revision; the requested
hero controls and entrance have now changed, while the video asset is retained.

