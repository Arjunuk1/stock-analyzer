const express = require("express");
const router = express.Router();

const passport = require('../config/passport');
const { signup, login, googleLogin, googleCallback, getProfile } = require("../controllers/authController");
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/signup', upload.single('profilePic'), signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/profile', auth, getProfile);

router.get('/auth/google', (req, res, next) => {
	if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
		return res.redirect('/login.html?error=google_not_configured');
	}
	return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login.html?error=google_login_failed' }), googleCallback);

module.exports = router;