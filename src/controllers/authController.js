const User = require('../models/User');
const bcrypt = require('bcrypt');
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

        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePic = req.file ? `/uploads/${req.file.filename}` : '';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePic
        });

        return res.status(201).json({
            message: 'Signup successful',
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

        const isMatch = await bcrypt.compare(password, user.password);
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

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || 'Google User',
                email,
                password: null,
                authProvider: 'google',
                googleId: req.user.id || null
            });
        } else if (!user.authProvider || user.authProvider === 'local') {
            user.authProvider = 'google';
            user.googleId = req.user.id || user.googleId || null;
            await user.save();
        }

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
            return res.redirect('/login.html?error=google_login_failed');
        }

        const { name, email, profilePic } = req.user;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: null,
                authProvider: 'google',
                googleId: req.user.id || null,
                profilePic: profilePic || ''
            });
        } else if (!user.profilePic && profilePic) {
            user.profilePic = profilePic;
            user.authProvider = 'google';
            user.googleId = req.user.id || user.googleId || null;
            await user.save();
        }

        const token = signToken({ id: user._id }, { expiresIn: '1h' });
        return res.redirect(`/login.html?token=${encodeURIComponent(token)}`);
    } catch (error) {
        console.error('Google callback error:', error.message || error);
        return res.redirect('/login.html?error=google_login_failed');
    }
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