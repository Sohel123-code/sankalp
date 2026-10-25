# SANKALP frontend redesign

## Current reference-led revision (24 October 2026)

The homepage body now uses the recording-led sequence documented in
[REFERENCE_MOTION.md](REFERENCE_MOTION.md): an original technology montage,
a pinned desktop wireframe/facts scene, masked headings, and staggered content
emerging from black. Mobile facts use shorter scroll reveals without pinning.
The homepage hero is unchanged. The shared public-page body styling, track
cards, navigation and footer use a quieter dark/orange presentation.
The historical implementation notes below describe earlier iterations where
they conflict with this current revision.

Run from `sankalp/frontend`:

```sh
npm install
npm run dev
npm run build
npm run test:ui
npm run test:scroll
npm run test:cinematic
```

The UI uses the supplied logo, Home hero recording, and locally adapted Framer
components. Pages share a dark orange palette and animated border buttons.
Home has a descending heading, scroll-linked text, curved sections and a day
preview. Programme has a sticky day selector, activity filter, scroll-linked
session ribbon and expandable parallel workshop details. Tracks, Workshops,
Innovation Challenge and Showcase use different effects. Motion respects the
device's reduced-motion setting, and the hero video has a pause control.

## Content and existing functionality

The provided content master controls the public page structure, programme,
fees, workshops and policy outlines. Dates, venue, contacts, speakers and
unapproved policies are marked as pending. Unsupported venue promises and
refund rules from the previous UI were removed.

Backend files, authentication services, credentials, environment
configuration and database setup are unchanged. Existing
frontend form handlers and the registration calculator are retained. Several
summit enquiry/interest forms were already local React state previews; their
copy now describes that accurately, rather than claiming delivery, bookings
or fabricated reference numbers. This UI task does not add payment processing,
email delivery, submission persistence or a CMS.

## Compact interface and account refinement

The homepage now uses one selectable track display, a three-session preview,
a scroll-drawn comet and a cursor-responsive gravity mesh. About uses the
supplied reactor effect. See `src/components/effects/README.md` for the local
source mapping. Research topics, workshop curricula, programme descriptions
and secondary requirements use expandable details instead of large text grids.
Decorative emoji are removed; close controls use stroke SVGs.

Inter body text and Manrope headings replace Outfit. Shared chapter heroes
fill the viewport below the fixed header, while body headings and copy are
smaller. Desktop navigation includes Home and Contact alongside the core links and a grouped Explore panel;
mobile navigation has keyboard dismissal and a focus loop.

Frontend authentication state now consumes the session already returned by
the existing registration endpoint. Successful registration opens the account
profile directly. Authenticated users see their profile at the top right;
login and sign-up routes redirect to their profile. Registration prompts adapt
to the signed-in state. The API currently has no participant category, so the
UI uses `Member` unless a participant/account type is supplied. It does not
infer a category from the fee calculator or claim a confirmed summit pass.

## Scroll choreography reference

The 2026-10-23 09:49:46 recording was inspected frame by frame. Its section
reveals informed the new five-scene home sequence: a masked scale-up, progressive
heading characters, staggered rising content, a short desktop hold and a
receding exit. These are tied to native scroll position and reverse when the
visitor scrolls back. No wheel interception or mandatory scroll snapping is used.

`ScrollScene.jsx` measures natural content height and only pins scenes that fit
the desktop viewport. Mobile and tall sections remain in normal flow. Other
pages use `ScrollPage.jsx` for progressive heading wipes and staggered card
reveals; programme sessions use their own scroll-linked rise and scale.
Dialogs remain outside the reveal system, keyboard focus makes controls fully
visible, and reduced-motion mode removes pinning and masking.

## Liquid covers and navigation

The supplied AnimatedLiquidBackground shader now uses yellow, orange and black.
Programme, Workshops, Investor Connect, Showcase, Partnerships, Speakers,
Venue, FAQ and Contact use distinct flow compositions. Home retains its video.
The workshop body retains the supplied ASCII field; Tracks retains Ridgeline.
Effects mount near the viewport and use a static gradient in reduced-motion mode.

Home and Contact have direct header links with exact route highlighting.
Home also has five chapter links; Contact has desk/form shortcuts and a Home link.
Supporting descriptions, travel guidance and contact desks use disclosures.
Programme preserves every source session and time, grouped by start time into
morning, afternoon and evening. Day selection, type filters, chapter anchors,
scroll-drawn rails and expandable details work together without a table.

## Verification

### Additive cinematic refinement

The latest refinement preserves the existing sections, content, navigation,
desktop layout, typography and palette. GSAP/ScrollTrigger is loaded separately
for decorative hero parallax and title masks; Framer retains ownership of the
existing section animations. No extra pin spacers, content wrappers or sections
are introduced by GSAP. Its media-query contexts are reverted on route changes.

About's existing hero artwork now contains a lightweight projected wireframe
mesh. It caps pixel density and update rate, pauses offscreen/in hidden tabs,
and renders a static frame for reduced motion. Existing buttons and artwork
receive bounded pointer feedback only on fine-pointer devices. Home's video
also pauses outside the viewport and in hidden tabs.

Following feedback on the live About page, the mesh now rotates and deforms
more visibly and responds to scroll progress. The existing reactor and journey
content have a coordinated scroll entrance, with a separate mobile trigger for
the content below the reactor. Hero text enters from one viewport above its
resting position; route changes reset scrolling immediately so the previous
page's scroll position cannot obscure the entrance. Reduced motion stays static.

Responsive changes constrain intrinsic grid minimums to available width, keep
fields and dialogs within phone screens, allow long text to wrap, enlarge touch
targets and release the mobile menu's scroll lock when resizing to desktop.
Desktop grid track sizes and page composition remain unchanged.

`test:cinematic` verifies decorative transforms, route cleanup, unchanged DOM
and text, pointer feedback, and touch/reduced-motion fallbacks. The production
build, UI tests, scroll tests and cinematic tests pass. Live browser inventory
is empty, so actual mobile/tablet visual QA remains unverified.

`test:ui` renders routes and checks day/filter switching, parallel room details,
track search/reset, workshop tabs, group discount and add-on calculations,
mobile menu dismissal and protected-route behavior in an isolated DOM.
It also checks automatic registration state, signed-in auth redirects,
profile labels, mobile account controls, logout, login, and emoji-free routes.
Network requests are mocked, and no account or database records are changed.

`test:scroll` checks both normal and reduced-motion modes. It simulates real
scroll events in the DOM, verifies reverse-scroll states, same-row staggering,
and checks that pinning switches off for mobile screens and tall content.

Latest checks (23 October 2026): all 21 route renders, account interactions,
programme grouping/filtering, Home/Contact anchors, and both scroll modes passed.

The production build is also required. DOM tests do not validate visual
layout or WebGL rendering. Live desktop/mobile browser QA remains necessary.
Computer Use could not connect to its native helper in the latest verification
attempt. No live browser inspection was completed in this refinement.
# Additional Framer effects — October 23

Integrated the seven newly supplied references directly into this source tree. Velarium opens Home, Waveslics animates the Programme hero, CurvedCarousel provides the Speakers hero artwork, DragableCarousel enhances the existing Showcase participant cards, TextRevealHelper animates the About introduction, and TypewriterEffect types the unchanged Contact subtitle once. The supplied LoadScreen's column choreography is adapted for actual loading fallbacks.

The homepage intro is skippable, contained below navigation, and followed by the existing full-height title entrance. Static/reduced-motion fallbacks preserve content. The extra deployment ZIP was removed; `DEPLOY_VERCEL.md` now describes pushing this repository directly.

Validation: production build, existing UI/scroll/cinematic checks, and `test:framer` component interaction checks. No live browser was available for visual QA in this session.

