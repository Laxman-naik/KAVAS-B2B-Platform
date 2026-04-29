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

    const vendorResult = await client.query(`
      INSERT INTO vendorprofile (email, phone, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email, phone
    `, [email, phone, hashedPassword]);

    const vendor = vendorResult.rows[0];

    const onboardingResult = await client.query(`
      INSERT INTO vendor_onboarding (vendor_id, status)
      VALUES ($1, 'draft')
      RETURNING id
    `, [vendor.id]);

    const onboarding = onboardingResult.rows[0];

    await client.query("COMMIT");

    const token = jwt.sign(
      { id: vendor.id, type: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Vendor registered successfully",
      token,
      vendor,
      onboarding_id: onboarding.id
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(400).json({
      message: err.message || "Registration failed"
    });
  } finally {
    client.release();
  }
};

const sendOtp = async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone && !email) {
      return res.status(400).json({ message: "Phone or email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await db.query(`
      INSERT INTO otp_verifications (identifier, otp, expires_at)
      VALUES ($1, $2, now() + interval '5 minutes')
    `, [phone || email, otp]);

    console.log("OTP:", otp);

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const result = await db.query(`
      SELECT * FROM otp_verifications
      WHERE identifier = $1
        AND otp = $2
        AND expires_at > now()
      ORDER BY created_at DESC
      LIMIT 1
    `, [identifier, otp]);

    if (!result.rows.length) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = { registerVendor, sendOtp, verifyOtp};