const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

// Never load local credentials or contact the real database in this suite.
process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';
process.env.SUPABASE_URL = 'https://test.invalid';
process.env.SUPABASE_ANON_KEY = 'test-only';
process.env.JWT_SECRET = 'deployment-test-only-secret';
process.env.FRONTEND_URL = 'https://summit.example/';
process.env.VERCEL_URL = 'sankalp-preview.vercel.app';
process.env.VERCEL_BRANCH_URL = 'sankalp-git-main.vercel.app';
process.env.VERCEL_PROJECT_PRODUCTION_URL = 'sankalp.vercel.app';

const records = [];
const supabaseModule = require.resolve('@supabase/supabase-js');
require.cache[supabaseModule] = {
  id: supabaseModule, filename: supabaseModule, loaded: true,
  exports: {
    createClient() {
      return {
        from(table) {
          assert.equal(table, 'registration');
          let filter, insert, fields;
          return {
            select(value) { fields = value.split(',').map((field) => field.trim()); return this; },
            eq(key, value) { filter = [key, value]; return this; },
            insert(rows) { insert = rows[0]; return this; },
            async single() {
              let row;
              if (insert) {
                row = { id: records.length + 1, ...insert };
                records.push(row);
              } else {
                row = records.find((record) => record[filter[0]] === filter[1]);
              }
              return { data: row ? Object.fromEntries(fields.map((key) => [key, row[key]])) : null, error: null };
            },
          };
        },
      };
    },
  },
};

const handler = require('../../api/index');
let server, base;
before(async () => {
  assert.equal(typeof handler, 'function');
  assert.equal(handler, require('../app'));
  server = handler.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));

function post(path, body, headers = {}) {
  return fetch(`${base}/api/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

test('health and unknown API routes return JSON', async () => {
  assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { status: 'ok' });
  const missing = await fetch(`${base}/api/missing`);
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get('content-type'), /application\/json/);
});

test('registration, existing login, cookie session and logout keep the API contract', async () => {
  const account = { username: 'deployment-check', gmail: 'test@example.com', password: 'example-password' };
  const registered = await post('register', account, { Origin: 'https://sankalp-preview.vercel.app' });
  assert.equal(registered.status, 201);
  const result = await registered.json();
  assert.deepEqual(result.user, { id: 1, username: account.username, gmail: account.gmail });
  assert.ok(result.token);
  assert.notEqual(records[0].password, account.password);
  assert.equal(registered.headers.get('access-control-allow-origin'), 'https://sankalp-preview.vercel.app');
  const cookie = registered.headers.get('set-cookie');
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/']) assert.ok(cookie.includes(flag), flag);
  const me = await fetch(`${base}/api/me`, { headers: { Cookie: cookie.split(';')[0] } });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).user.username, account.username);
  assert.equal((await post('register', account)).status, 409);
  assert.equal((await post('register', { ...account, username: 'different' })).status, 409);
  assert.equal((await post('login', { ...account, password: 'wrong' })).status, 401);
  const login = await post('login', account);
  assert.equal(login.status, 200);
  assert.deepEqual((await login.json()).user, result.user);
  const bearer = await fetch(`${base}/api/me`, { headers: { Authorization: `Bearer ${result.token}` } });
  assert.equal(bearer.status, 200);
  const logout = await post('logout', {});
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /auth_token=;/);
  assert.match(logout.headers.get('set-cookie'), /Secure/);
  assert.match(logout.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/);
});

test('validation and unauthenticated requests remain protected', async () => {
  assert.equal((await post('register', {})).status, 400);
  assert.equal((await post('register', { username: 'test', gmail: 'invalid', password: '123456' })).status, 400);
  assert.equal((await post('register', { username: 'test', gmail: 'test@example.com', password: '123' })).status, 400);
  assert.equal((await post('login', {})).status, 400);
  assert.equal((await fetch(`${base}/api/me`)).status, 401);
  assert.equal((await fetch(`${base}/api/me`, { headers: { Cookie: 'auth_token=invalid' } })).status, 401);
});

test('only exact configured origins receive credentialed CORS access', async () => {
  for (const origin of ['https://summit.example', 'https://sankalp.vercel.app', 'https://sankalp-git-main.vercel.app', 'http://localhost:5173']) {
    const response = await fetch(`${base}/api/health`, { headers: { Origin: origin } });
    assert.equal(response.headers.get('access-control-allow-origin'), origin);
    assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
  }
  const preflight = await fetch(`${base}/api/login`, { method: 'OPTIONS', headers: { Origin: 'https://summit.example', 'Access-Control-Request-Method': 'POST' } });
  assert.equal(preflight.status, 204);
  const blocked = await fetch(`${base}/api/health`, { headers: { Origin: 'https://unrelated.vercel.app' } });
  assert.equal(blocked.headers.get('access-control-allow-origin'), null);
});
