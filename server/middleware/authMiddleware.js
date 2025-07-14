const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

exports.checkAuth = async (req, res, next) => {
  console.log("[CHECK AUTH] Cookie token:", req.cookies.token); // 🧠 Log cookie xem có không

  try {
    const token = req.cookies.token;

    if (!token) {
      console.warn("[AUTH] ❌ No token found in cookie");
      return res.status(401).json({ message: 'Not logged in - no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      console.warn("[AUTH] ❌ User not found for email:", decoded.email);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log("[AUTH] ✅ Authenticated user:", user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error("[AUTH ERROR]", err);
    res.status(401).json({ message: 'Auth failed', error: err.message });
  }
};


exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
