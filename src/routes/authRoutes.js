const express = require("express");
const router = express.Router();

const passport = require('../config/passport');
const { signup, login, googleLogin, googleCallback, getProfile, googleAuthStart } = require("../controllers/authController");
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/signup', upload.single('profilePic'), signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/profile', auth, getProfile);

router.get('/auth/google', googleAuthStart);

router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://127.0.0.1:5500/frontend/login.html?error=google_login_failed' }), googleCallback);

module.exports = router;