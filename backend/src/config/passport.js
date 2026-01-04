import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

/**
 * Passport OAuth Configuration
 * Supports Google and Facebook authentication
 */

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/v1/auth/google/callback`,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const email = profile.emails[0].value;
          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          const googleId = profile.id;

          // Check if user already exists
          let user = await User.findOne({ email });

          if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
              user.googleId = googleId;
              await user.save();
            }
          } else {
            // Create new user
            user = new User({
              email,
              googleId,
              profile: {
                firstName,
                lastName
              },
              // OAuth users don't have passwords
              passwordHash: null
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/v1/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name'],
        enableProof: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Facebook profile
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

          if (!email) {
            return done(new Error('No email provided by Facebook'), null);
          }

          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          const facebookId = profile.id;

          // Check if user already exists
          let user = await User.findOne({ email });

          if (user) {
            // Update Facebook ID if not set
            if (!user.facebookId) {
              user.facebookId = facebookId;
              await user.save();
            }
          } else {
            // Create new user
            user = new User({
              email,
              facebookId,
              profile: {
                firstName,
                lastName
              },
              // OAuth users don't have passwords
              passwordHash: null
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
