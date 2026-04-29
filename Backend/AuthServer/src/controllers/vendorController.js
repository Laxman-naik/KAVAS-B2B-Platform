const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const otpStore = new Map();

const registerVendor = async (req, res) => {
  const client = await db.connect();

  try {
    const { email, phone, password, confirmPassword } = req.body;

    const emailData = otpStore.get(email);
    const phoneData = otpStore.get(phone);

    if (!emailData?.verified || !phoneData?.verified) {
      return res.status(400).json({
        message: "Verify OTP before registration"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendorResult = await client.query(`
      INSERT INTO vendorprofile (
        email, phone, password_hash, email_verified, phone_verified
      )
      VALUES ($1, $2, $3, true, true)
      RETURNING id
    `, [email, phone, hashedPassword]);

    const vendorId = vendorResult.rows[0].id;

    const onboarding = await client.query(`
      INSERT INTO vendor_onboarding (vendor_id, status)
      VALUES ($1, 'draft')
      RETURNING id
    `, [vendorId]);

    await client.query("COMMIT");

    // cleanup
    otpStore.delete(email);
    otpStore.delete(phone);

    res.json({
      message: "Registered successfully",
      onboarding_id: onboarding.rows[0].id
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

    if (!email || !phone) {
      return res.status(400).json({ message: "Email & phone required" });
    }

    const emailOtp = Math.floor(100000 + Math.random() * 900000);
    const phoneOtp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(email, {
      otp: emailOtp,
      expires: Date.now() + 5 * 60 * 1000,
      verified: false
    });

    otpStore.set(phone, {
      otp: phoneOtp,
      expires: Date.now() + 5 * 60 * 1000,
      verified: false
    });

    console.log("Email OTP:", emailOtp);
    console.log("Phone OTP:", phoneOtp);

    res.json({ message: "OTP sent" ,EmailOTP : emailOtp, PhoneOTP: phoneOtp });

  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, phone, emailOtp, phoneOtp } = req.body;

    const emailData = otpStore.get(email);
    const phoneData = otpStore.get(phone);

    if (!emailData || !phoneData) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (emailData.otp != emailOtp || phoneData.otp != phoneOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (emailData.expires < Date.now() || phoneData.expires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    emailData.verified = true;
    phoneData.verified = true;

    otpStore.set(email, emailData);
    otpStore.set(phone, phoneData);

    res.json({ message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = { registerVendor, sendOtp, verifyOtp};