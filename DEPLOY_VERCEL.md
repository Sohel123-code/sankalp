# Deploy Sankalp on Vercel

The frontend and Express API deploy in **one Vercel project**. Supabase remains the existing database service; no database migration or account recreation is required.

## 1. Push this project

All changes are in this working `sankalp` directory. Commit and push from this repository, including `frontend`, `backend`, `api`, the root package files, and `vercel.json`. No ZIP or separate source folder is needed. Run Git commands from `sankalp`, not its `frontend` subfolder.

Local `.env` files remain on your computer and are now ignored and removed from Git's index. Include those staged removals in your next commit. They were previously tracked, so earlier commits may still contain their values; this change does not rewrite Git history. Dependencies and build output are also ignored.

## 2. Import into Vercel

In Vercel, choose **Add New → Project**, then import the GitHub repository. Use these settings:

| Setting | Value |
| --- | --- |
| Root Directory | Directory containing `vercel.json` (usually `./`) |
| Framework Preset | Other |
| Node.js Version | 24.x |
| Install Command | `npm run setup` |
| Build Command | `npm run build` |
| Output Directory | `frontend/dist` |

The checked-in configuration already provides the install/build/output settings. Do not select only the frontend folder: the API needs the backend folder in the same deployment. Keep **Automatically expose System Environment Variables** enabled so the backend recognizes Vercel deployment domains. [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json), [system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables).

## 3. Add environment variables before deploying

Copy values from your existing local files into the Vercel project's environment-variable settings. Apply them to Production and Preview if both should use the current database.

| Variable | Copy from |
| --- | --- |
| `VITE_SUPABASE_URL` | `frontend/.env` |
| `VITE_SUPABASE_ANON_KEY` | `frontend/.env` |
| `SUPABASE_URL` | `backend/.env` |
| `SUPABASE_ANON_KEY` | `backend/.env` |
| `JWT_SECRET` | `backend/.env` — keep the same existing secret |
| `FRONTEND_URL` | Your final site origin, such as `https://your-project.vercel.app` |

`FRONTEND_URL` may be omitted for the first deployment: the generated Vercel URL is allowed automatically. Once your final domain is known, set it and redeploy. Use an origin without a path. If you connect a custom domain later, update this value and redeploy. Do not set `PORT` on Vercel.

Only the two `VITE_` variables go into the browser build. Never put `JWT_SECRET` or a Supabase service-role key in a `VITE_` variable. Continue using the same public/anon key the current app uses. No schema changes or setup SQL are needed for an existing working database.

Changes to environment variables apply to new deployments; redeploy after edits. [Vercel environment variables](https://vercel.com/docs/environment-variables).

## 4. Deploy and check

Click **Deploy**. After completion:

1. Open `/api/health`; expect `{"status":"ok"}`. This checks API startup, not database connectivity.
2. Open `/about` directly and refresh. The website should load rather than return a hosting 404.
3. Sign in using an existing account, open the dashboard, refresh, and sign out.
4. If testing registration, use a deliberate test account: the deployed app writes to your existing database.
5. Check the Home animation, About mesh, Programme filters, mobile menu, and page entrances on a phone.

The frontend uses `/api` on the same domain. Vercel routes those requests to `api/index.js`, which exports the existing Express app. The app issues HTTPS-only authentication cookies in production; local HTTP development remains supported. Page routes fall back to `index.html`, while built assets are served normally. [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js), [rewrites](https://vercel.com/docs/routing/rewrites).

## Troubleshooting

- **Build cannot find package.json:** select the directory with the root `package.json` and `vercel.json`.
- **API returns 500:** inspect Vercel function logs; verify `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `JWT_SECRET` in the deployed environment.
- **Database/event loading fails:** check both frontend `VITE_` values, then rebuild. Use the same Supabase project as before.
- **CORS error on a custom domain:** set `FRONTEND_URL` to the exact HTTPS origin and redeploy.
- **API request returns HTML:** verify the root `vercel.json` is included and the API rewrite precedes the page fallback.

This configuration preserves the existing product behavior. Forms that currently provide only a local preview are not converted into email delivery or database submissions by deployment.
