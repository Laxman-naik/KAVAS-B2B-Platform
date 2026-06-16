const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");

const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const fullName = profile.displayName || "Google User";
        const avatar = profile.photos?.[0]?.value || null;

        if (!email) {
          return done(null, false);
        }

        let userResult = await pool.query(
          `
          SELECT *
          FROM users
          WHERE email = $1
          `,
          [email]
        );

        let user = userResult.rows[0];

        if (!user) {
          const passwordHash = await bcrypt.hash(
            `google_login_${googleId}_${Date.now()}`,
            10
          );

          const insert = await pool.query(
            `
            INSERT INTO users (
              full_name,
              email,
              password_hash,
              role
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [fullName, email, passwordHash, "buyer"]
          );

          user = insert.rows[0];
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;