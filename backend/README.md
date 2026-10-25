# Sankalp backend

The existing Express API uses Supabase's `registration` table, bcrypt password hashes, and JWT authentication. The database schema and response formats are unchanged.

- `app.js`: Express application, routes, cookies, CORS, and database access. Exports the app without starting a listener.
- `server.js`: Starts the app on port 3000 for local development.
- `tests/deployment.test.cjs`: Tests authentication and hosting behavior with an in-memory database substitute.
- `supabase_setup.sql`: Existing database setup reference. Do not rerun it for an already configured database.

Run `npm run dev:backend` from the project root. Vercel uses `../api/index.js` to load the same app as a function; it does not run `server.js`.

| Endpoint | Purpose |
| --- | --- |
| `POST /api/register` | Create an account and set the session cookie |
| `POST /api/login` | Sign in with existing credentials |
| `POST /api/logout` | Clear the session cookie |
| `GET /api/me` | Read the authenticated user |
| `GET /api/health` | Check API startup without querying the database |

Keep local settings in `.env`. On Vercel, use project environment variables as described in [the deployment guide](../DEPLOY_VERCEL.md).
