const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");

const pool = require("./db");
const { sendWelcomeEmail } = require("../utils/emailService");
const { createNotification } = require("../utils/notificationHelper");

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
            `google_login_${googleId}_${process.env.ACCESS_SECRET}`,
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

          // Send the same welcome/confirmation email as normal registration
          sendWelcomeEmail(email, fullName);

          // Insert a welcome notification
          createNotification({
            userId:  user.id,
            title:   "Welcome to KAVAS Wholesale Hub! 🎉",
            message: `Hi ${fullName.split(" ")[0]}, your account is ready. Start exploring thousands of wholesale products at the best prices.`,
            type:    "System",
            role:    user.role || "buyer",
          });
        } else {
          await pool.query(
            `
            UPDATE users
            SET full_name = COALESCE($1, full_name)
            WHERE id = $2
            `,
            [fullName, user.id]
          );
        }

        return done(null, user);
      } catch (err) {
        console.error("GOOGLE LOGIN ERROR:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;