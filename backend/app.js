const path = require('node:path');
// Vercel supplies environment variables; local development reads backend/.env.
if (!process.env.VERCEL) {
  require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
}
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// ─── Init ──────────────────────────────────────────────────────────────────
const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── Allowed origins (Vite dev server picks a free port 5173-5176)
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  process.env.FRONTEND_URL,
  ...['VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL']
    .map((key) => process.env[key] && `https://${process.env[key]}`),
].filter(Boolean).map((origin) => new URL(origin).origin);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, Postman) or whitelisted origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // required for httpOnly cookies
  })
);

// ─── Helpers ───────────────────────────────────────────────────────────────
const SALT_ROUNDS = 12;
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
  sameSite: 'lax',
  path: '/',
};

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function setCookieToken(res, token) {
  res.cookie('auth_token', token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
}

// ─── Middleware: Authenticate ──────────────────────────────────────────────
function authenticate(req, res, next) {
  const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ─── ROUTES ────────────────────────────────────────────────────────────────

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { username, gmail, password } = req.body;

    // ── Validation
    if (!username || !gmail || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmail)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // ── Check duplicate username
    const { data: existingUser } = await supabase
      .from('registration')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    // ── Check duplicate email
    const { data: existingEmail } = await supabase
      .from('registration')
      .select('id')
      .eq('gmail', gmail)
      .single();

    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // ── Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // ── Insert into Supabase
    const { data, error } = await supabase
      .from('registration')
      .insert([{ username, gmail, password: hashedPassword }])
      .select('id, username, gmail')
      .single();

    if (error) throw error;

    // ── Issue JWT
    const token = signToken({ id: data.id, username: data.username, gmail: data.gmail });
    setCookieToken(res, token);

    return res.status(201).json({
      message: 'Registration successful!',
      user: { id: data.id, username: data.username, gmail: data.gmail },
      token,
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // ── Fetch user from DB
    const { data: user, error } = await supabase
      .from('registration')
      .select('id, username, gmail, password')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // ── Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // ── Issue JWT
    const token = signToken({ id: user.id, username: user.username, gmail: user.gmail });
    setCookieToken(res, token);

    return res.status(200).json({
      message: 'Login successful!',
      user: { id: user.id, username: user.username, gmail: user.gmail },
      token,
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_token', cookieOptions);
  return res.status(200).json({ message: 'Logged out successfully.' });
});

// GET /api/me  (protected — verify session)
app.get('/api/me', authenticate, (req, res) => {
  return res.status(200).json({ user: req.user });
});

// ─── Start ─────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

module.exports = app;
