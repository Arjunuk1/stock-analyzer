const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT || 3000}/api/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        const userData = {
          id: profile.id,
          name: profile.displayName || 'Google User',
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
          profilePic: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
        };
        done(null, userData);
      }
    )
  );
}

module.exports = passport;