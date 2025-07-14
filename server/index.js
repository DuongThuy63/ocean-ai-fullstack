require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Readable } = require('stream');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const Meet = require('./models/meetSchema');
const User = require('./models/userSchema');
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { checkAuth } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const MONGO_URI = process.env.MONGO_URI;
const AI_SERVER_URL = process.env.AI_SERVER_URL;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/oauth/google/callback",
  scope: ["profile", "email"],
  passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {
  try {
    const email = profile?.emails?.[0]?.value;
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, name: profile.displayName });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [CLIENT_URL, "chrome-extension://pkgiglhninikcahjlpcmcnlcmkijabfi"];
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB connect
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- API ROUTES ---

app.get('/api/users/check', checkAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    res.json({
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        autoEnabled: user.autoEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/meet', async (req, res) => {
  try {
    const meetData = req.body;
    const email = meetData?.oceanAiEmail;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const screenshots = (meetData.screenshots || []).filter(s => s.filename).map(s => ({
      filename: s.filename,
      timestamp: s.timestamp || new Date(),
      takenBy: s.takenBy || email
    }));

    const newMeet = new Meet({
      ...meetData,
      speakerDuration: new Map(Object.entries(meetData.speakerDuration || {})),
      screenshots
    });

    await newMeet.save();

    if (user.autoEnabled && AI_SERVER_URL) {
      const payload = {
        meeting_data: newMeet,
        report_format: 'pdf',
        report_type: 'normal'
      };

      const response = await fetch(`${AI_SERVER_URL}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const reportBuffer = Buffer.from(await response.arrayBuffer());
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Your Report for ${newMeet.meetingTitle}`,
          text: 'Please find the attached report.',
          attachments: [{ filename: 'report.pdf', content: reportBuffer }]
        });
      }
    }

    res.status(201).json({ message: 'Meet created!', meet: newMeet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Meet creation error', error: error.message });
  }
});

app.post('/api/get-report', checkAuth, async (req, res) => {
  const { meeting_id, meeting_title, report_format, report_type, report_interval, emails } = req.body;

  try {
    const meet = await Meet.findById(meeting_id);
    if (!meet) return res.status(404).json({ message: 'Meet not found' });

    const payload = {
      meeting_data: meet,
      report_format,
      report_type,
      report_interval: Number(report_interval)
    };

    const response = await fetch(`${AI_SERVER_URL}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("AI Server error");

    const arrayBuffer = await response.arrayBuffer();
    const reportBuffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Disposition', `attachment; filename=report.${report_format}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(reportBuffer);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const email of emails || []) {
      if (email.includes('@')) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Your Report for ${meeting_title}`,
          text: 'Please find the attached report.',
          attachments: [{ filename: `report.${report_format}`, content: reportBuffer }]
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Report error', error: err.message });
  }
});

app.get('/api/auto-enabled', checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  res.json({ autoEnabled: user?.autoEnabled || false });
});

app.post('/api/auto-enabled', checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  user.autoEnabled = req.body.autoEnabled;
  await user.save();
  res.json({ message: 'Updated' });
});

// Google OAuth routes
app.get('/api/oauth/google', passport.authenticate("google", { scope: ["profile", "email"] }));
app.get('/api/oauth/google/callback',
  passport.authenticate("google", { session: false, failureRedirect: `${CLIENT_URL}/failed` }),
  (req, res) => {
    const token = jwt.sign({ email: req.user.email, name: req.user.name }, process.env.JWT_KEY, { expiresIn: '5d' });
    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 5 * 86400000 });
    res.redirect(`${CLIENT_URL}/success`);
  }
);

app.get('/api/oauth/logout', (req, res) => {
  res.clearCookie("token");
  res.redirect(CLIENT_URL);
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
