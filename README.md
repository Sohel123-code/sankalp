# Sankalp Andhra 2026

The website and API are separate applications, deployed together as **one Vercel project**. The existing Supabase database, accounts, passwords, and API paths are retained.

```text
sankalp/
  frontend/             React + Vite website, animations, assets, UI tests
    src/
    public/
    .env.example
    package.json
  backend/              Express API, authentication, Supabase access
    app.js              Express application shared by local and Vercel entry points
    server.js           Local development server
    tests/
    .env.example
    package.json
  api/
    index.js            Small Vercel adapter that imports backend/app.js
  vercel.json           Frontend build, API routing, page refresh fallback
  package.json          Commands for both applications
  DEPLOY_VERCEL.md      Deployment steps and environment-variable mapping
```

All backend logic stays in `backend/`. The root `api/` directory is the Vercel function entry, not a second backend. Both applications use the same deployed domain; frontend requests continue to use `/api`.

## Local development

Use Node.js 24. From this directory:

```powershell
npm run setup
```

Keep your existing `backend/.env` and `frontend/.env`. For a fresh checkout, copy each `.env.example` to `.env` and supply the existing configuration privately.

Run these in two terminals:

```powershell
npm run dev:backend
```

```powershell
npm run dev:frontend
```

Vite runs on port 5173 and proxies `/api` to the backend on port 3000. `npm run build` builds the website. `npm test` runs backend deployment checks and existing UI/motion checks. Backend tests use an in-memory database substitute and never access real accounts.

## Deploy

Follow [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md). Select the directory containing `vercel.json` as the Vercel root directory, not `frontend/` or `backend/`. No separate backend host is required.
