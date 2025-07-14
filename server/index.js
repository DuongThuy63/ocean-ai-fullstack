require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

// Models & Middleware
const User = require('./models/userSchema');
const { checkAuth } = require('./middleware/authMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Google OAuth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/api/oauth/google/callback`,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, name: profile.displayName });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith("chrome-extension://") || origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(passport.initialize());

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// === API ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/admin', adminRoutes);

// === HEALTH CHECK ===
app.get('/api/health', (_, res) => res.send('✅ API running'));

// === GOOGLE OAUTH ===
app.get('/api/oauth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

app.get('/api/oauth/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: `${process.env.CLIENT_URL}/failed`
}), (req, res) => {
  const token = jwt.sign(
    { email: req.user.email, name: req.user.name },
    process.env.JWT_KEY,
    { expiresIn: '5d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 5 * 24 * 60 * 60 * 1000
  });

  res.redirect(`${process.env.CLIENT_URL}/success`);
});

// === LOGOUT ROUTE (optional) ===
app.get('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.redirect(`${process.env.CLIENT_URL}/logout-success`);
});

// === SERVE FRONTEND ===
const clientPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
