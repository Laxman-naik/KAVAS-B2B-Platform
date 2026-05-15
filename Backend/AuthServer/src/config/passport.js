const passport = require("passport");
const GoogleStrategy =
  require("passport-google-oauth20").Strategy;

const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const googleId = profile.id;

        const email =
          profile.emails?.[0]?.value;

        const fullName =
          profile.displayName;

        const avatar =
          profile.photos?.[0]?.value;

        let userResult =
          await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            OR google_id = $2
            `,
            [email, googleId]
          );

        let user =
          userResult.rows[0];

        if (!user) {
          const insert =
            await pool.query(
              `
              INSERT INTO users (
                full_name,
                email,
                google_id,
                avatar_url,
                role,
                email_verified,
                is_active
              )
              VALUES (
                $1,$2,$3,$4,
                'buyer',
                true,
                true
              )
              RETURNING *
              `,
              [
                fullName,
                email,
                googleId,
                avatar,
              ]
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