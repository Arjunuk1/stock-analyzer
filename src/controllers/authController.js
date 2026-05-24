const User = require('../models/User');
const { signToken } = require('../config/jwt');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const profilePic = req.file ? `/uploads/${req.file.filename}` : '';

        // password will be hashed automatically by User model pre-save hook
        const user = await User.create({
            name,
            email,
            password,
            profilePic
        });

        const token = signToken({ id: user._id }, { expiresIn: '1h' });

        return res.status(201).json({
            message: 'Signup successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        console.error('Signup error:', error.message || error);
        return res.status(500).json({ message: 'Signup failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ id: user._id }, { expiresIn: '1h' });

        return res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login error:', error.message || error);
        return res.status(500).json({ message: 'Login failed' });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOrCreateGoogleUser({
            name,
            email,
            googleId: req.user ? req.user.id : null
        });

        const token = signToken({ id: user._id }, { expiresIn: '1h' });

        return res.json({
            message: 'Google login successful',
            token
        });
    } catch (error) {
        console.error('Google login error:', error.message || error);
        return res.status(500).json({ message: 'Google login failed' });
    }
};

exports.googleCallback = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.redirect('http://127.0.0.1:5500/frontend/login.html?error=google_login_failed');
        }

        const { name, email, profilePic } = req.user;
        const user = await User.findOrCreateGoogleUser({
            name,
            email,
            profilePic,
            googleId: req.user.id
        });

        const token = signToken({ id: user._id }, { expiresIn: '1h' });
        return res.redirect(`http://127.0.0.1:5500/frontend/login.html?token=${encodeURIComponent(token)}`);
    } catch (error) {
        console.error('Google callback error:', error.message || error);
        return res.redirect('http://127.0.0.1:5500/frontend/login.html?error=google_login_failed');
    }
};

exports.googleAuthStart = (req, res, next) => {
    const passport = require('../config/passport');
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect('http://127.0.0.1:5500/frontend/login.html?error=google_not_configured');
    }
    return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    } catch (error) {
        console.error('Profile error:', error.message || error);
        return res.status(500).json({ message: 'Failed to fetch profile' });
    }
};