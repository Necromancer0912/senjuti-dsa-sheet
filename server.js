require('dotenv').config();
const express  = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs   = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR); } catch (err) {}

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'dsa-tracker-secret'],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Passport ────────────────────────────────────────────────────────────────
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/auth/google/callback` : `http://localhost:${PORT}/auth/google/callback`,
}, (_at, _rt, profile, done) => {
  return done(null, {
    id:     profile.id,
    name:   profile.displayName,
    email:  profile.emails?.[0]?.value || '',
  });
}));

passport.serializeUser((user, done)   => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ── Database / Storage ──────────────────────────────────────────────────────
const redis = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)
  ? Redis.fromEnv() 
  : null;

const userFile = id => path.join(DATA_DIR, `${id}.json`);

const loadProg = async (id) => {
  if (redis) {
    let data = await redis.get(`user:${id}`);
    if (!data) data = {};
    if (!data._avatarSeed) {
      data._avatarSeed = Math.random().toString(36).substring(2, 10);
      await redis.set(`user:${id}`, data);
    }
    return data;
  } else {
    const f = userFile(id);
    let data = {};
    try {
      if (fs.existsSync(f)) data = JSON.parse(fs.readFileSync(f, 'utf8'));
    } catch {}
    if (!data._avatarSeed) {
      data._avatarSeed = Math.random().toString(36).substring(2, 10);
      fs.writeFileSync(f, JSON.stringify(data, null, 2));
    }
    return data;
  }
};

const saveProg = async (id, data) => {
  if (redis) {
    await redis.set(`user:${id}`, data);
  } else {
    fs.writeFileSync(userFile(id), JSON.stringify(data, null, 2));
  }
};

// ── Auth Routes ──────────────────────────────────────────────────────────────
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed' }),
  (req, res) => res.redirect('/')
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session = null;
    res.redirect('/');
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.get('/api/me', async (req, res) => {
  if (!req.user) return res.json({ user: null, progress: {} });
  const data = await loadProg(req.user.id);
  res.json({ user: { ...req.user, avatarSeed: data._avatarSeed }, progress: data });
});

app.post('/api/progress', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { key, done } = req.body;
  const prog = await loadProg(req.user.id);
  if (done) prog[key] = true;
  else      delete prog[key];
  await saveProg(req.user.id, prog);
  res.json({ ok: true, progress: prog });
});

// ── SPA Fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  const index = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(index)) {
    res.sendFile(index);
  } else {
    res.send('<h2>Run <code>cd client && npm run build</code> first, or use <code>npm run dev</code></h2>');
  }
});

// ── Start ────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀  DSA Tracker  →  http://localhost:${PORT}`);
    console.log(`    Google OAuth →  http://localhost:${PORT}/auth/google\n`);
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      console.warn('⚠️  GOOGLE_CLIENT_ID not set in .env — Google login will not work\n');
    }
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
