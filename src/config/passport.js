const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5001/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;

                // Check if user exists
                db.query(
                    'SELECT * FROM users WHERE email = ?',
                    [email],
                    (err, result) => {
                        if (err) return done(err);

                        if (result.length > 0) {
                            return done(null, result[0]);
                        } else {
                            // Create new user if they don't exist
                            // We'll use a random password since they'll login via Google
                            const dummyPassword = Math.random().toString(36).slice(-10);
                            db.query(
                                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                                [name, email, dummyPassword],
                                (err, insertResult) => {
                                    if (err) return done(err);

                                    db.query(
                                        'SELECT * FROM users WHERE id = ?',
                                        [insertResult.insertId],
                                        (err, newUser) => {
                                            if (err) return done(err);
                                            return done(null, newUser[0]);
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
        done(err, result[0]);
    });
});

module.exports = passport;
