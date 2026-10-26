# Sankalp frontend

React + Vite website. This directory contains the existing pages, navigation, account UI, motion effects, and public assets.

```text
src/
  components/     Shared UI and animation components
  context/        Authentication state
  data/           Summit content and visual theme configuration
  hooks/          Shared React hooks
  layouts/        Page layout
  lib/            Public Supabase client
  pages/          Route components and styles
  services/       Authentication API and event data access
  styles/         Shared visual and responsive styles
  utils/          Animation and data helpers
public/           Static assets, including hero media
scripts/          UI and motion checks
```

The reference-led body redesign is documented in [REFERENCE_MOTION.md](REFERENCE_MOTION.md).
`SummitHomeContent`, `SummitStory`, and `SummitSection` own the new homepage body;
`utils/referenceMotion.js` owns its GSAP timelines and the public-page card reveals.
`styles/summit-redesign.css` is scoped to the new body design. The homepage Hero
function, media and loading sequence are intentionally unchanged.

Run `npm run test:reference` for the reveal/reverse sequence, dynamic card cleanup,
desktop pinning and mobile/reduced-motion checks. `npm run test:ui` checks the
existing routes, forms and account interactions.

Use `npm run dev:frontend` from the project root. The Vite development server forwards `/api` requests to `backend` on port 3000. On Vercel, the API is served from the same domain.

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` belong in the frontend environment. Keep server secrets in the backend environment. See the root [deployment guide](../DEPLOY_VERCEL.md); deploy from the project root, not this subfolder.

Responsive styles are loaded last in `src/main.jsx` so page/effect styles cannot
accidentally replace the phone rules. Phones use readable native swipe cards for
tracks, an unpinned programme, and immediately visible session content. The
programme timeline scrolls its own rail without moving the document on load.

For real-browser layout checks, run `node scripts/mobile-audit.mjs` from this
folder and open `http://127.0.0.1:5176/__mobile-audit`. The isolated local preview
mocks API responses and checks 22 routes at 320, 390, 768 and 1024 pixels, including
mobile menus, expanded disclosures and the registration modal. It writes
`.mobile-audit.json` (ignored by Git). It does not submit forms or use real
accounts. This checks desktop Chrome rendering at narrow widths; physical iOS
and Android keyboard, browser chrome and touch behavior still need device review.
