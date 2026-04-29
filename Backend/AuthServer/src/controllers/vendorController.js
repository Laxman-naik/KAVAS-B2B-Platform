const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const registerVendor = async (req, res) => {
  const client = await db.connect();

  try {
    const { email, phone, password, confirmPassword } = req.body;

    if (!email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    await client.query("BEGIN");

    const existingVendor = await client.query(
      `SELECT id FROM vendorprofile WHERE email = $1 OR phone = $2`,
      [email, phone]
    );

    if (existingVendor.rows.length) {
      throw new Error("Vendor already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(`
      INSERT INTO vendorprofile (email, phone, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email, phone, email_verified, phone_verified
    `, [email, phone, hashedPassword]);

    await client.query("COMMIT");

    res.json({
      message: "Registered. Please verify OTP",
      vendor: result.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const identifier = email || phone;

    const check = await db.query(`
      SELECT id FROM vendorprofile
      WHERE email = $1 OR phone = $2
    `, [email, phone]);

    if (!check.rows.length) {
      return res.status(404).json({ message: "Vendor not found. Register first." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    if (email) {
      await db.query(`
        UPDATE vendorprofile
        SET email_otp = $1,
            email_otp_expires = now() + interval '5 minutes'
        WHERE email = $2
      `, [otp, email]);
    }

    if (phone) {
      await db.query(`
        UPDATE vendorprofile
        SET phone_otp = $1,
            phone_otp_expires = now() + interval '5 minutes'
        WHERE phone = $2
      `, [otp, phone]);
    }

    console.log("OTP:", otp);

    res.json({ message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const client = await db.connect();

  try {
    const { identifier, otp } = req.body;

    await client.query("BEGIN");

    let user;

    // check email
    let result = await client.query(`
      SELECT * FROM vendorprofile WHERE email = $1
    `, [identifier]);

    if (result.rows.length) {
      user = result.rows[0];

      if (user.email_otp == otp && user.email_otp_expires > new Date()) {
        await client.query(`
          UPDATE vendorprofile
          SET email_verified = true,
              email_otp = NULL,
              email_otp_expires = NULL
          WHERE email = $1
        `, [identifier]);
      }
    }

    // check phone
    result = await client.query(`
      SELECT * FROM vendorprofile WHERE phone = $1
    `, [identifier]);

    if (result.rows.length) {
      user = result.rows[0];

      if (user.phone_otp == otp && user.phone_otp_expires > new Date()) {
        await client.query(`
          UPDATE vendorprofile
          SET phone_verified = true,
              phone_otp = NULL,
              phone_otp_expires = NULL
          WHERE phone = $1
        `, [identifier]);
      }
    }

    // 🔥 check both verified
    const check = await client.query(`
      SELECT * FROM vendorprofile
      WHERE email = $1 OR phone = $2
    `, [identifier, identifier]);

    const vendor = check.rows[0];

    if (vendor.email_verified && vendor.phone_verified) {

      // create onboarding only once
      const existing = await client.query(`
        SELECT id FROM vendor_onboarding WHERE vendor_id = $1
      `, [vendor.id]);

      let onboardingId;

      if (!existing.rows.length) {
        const onboarding = await client.query(`
          INSERT INTO vendor_onboarding (vendor_id, status)
          VALUES ($1, 'draft')
          RETURNING id
        `, [vendor.id]);

        onboardingId = onboarding.rows[0].id;
      } else {
        onboardingId = existing.rows[0].id;
      }

      await client.query("COMMIT");

      const token = jwt.sign(
        { id: vendor.id, type: "vendor" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Verification complete. Proceed to onboarding",
        token,
        onboarding_id: onboardingId
      });
    }

    await client.query("COMMIT");

    return res.json({ message: "OTP verified" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Verification failed" });
  } finally {
    client.release();
  }
};

module.exports = { registerVendor, sendOtp, verifyOtp};