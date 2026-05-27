
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'session_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Provide access to uploaded profile pictures
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');

app.use('/api', authRoutes);
app.use('/api', stockRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Stock Analyzer API! The frontend is now completely separated." });
});

module.exports = app;