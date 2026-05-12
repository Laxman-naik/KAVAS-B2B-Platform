const passport = require("passport");
const GoogleStrategy =
  require("passport-google-oauth20").Strategy;

const bcrypt = require("bcryptjs");
const pool = require("../config/db");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        "http://localhost:5001/api/auth/google/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          profile.emails[0].value;

        const existingUser =
          await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
          );

        let user =
          existingUser.rows[0];

        if (!user) {
          const hashedPassword =
            await bcrypt.hash(
              Math.random().toString(36),
              10
            );

          const newUser =
            await pool.query(
              `
              INSERT INTO users
              (
                full_name,
                email,
                password_hash,
                role
              )

              VALUES
              ($1, $2, $3, $4)

              RETURNING *
              `,
              [
                profile.displayName,
                email,
                hashedPassword,
                "buyer",
              ]
            );

          user = newUser.rows[0];
        }

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport; 