import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import axios from "axios";
import { sendEmailOtp } from "../utils/emailService.js";
import { generateToken } from "../utils/jwt.js";

const otpStore = new Map();

export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const expires = Date.now() + 5 * 60 * 1000;

    // ================= PHONE OTP =================
    if (phone) {
      const phoneOtp = Math.floor(100000 + Math.random() * 900000);
      const key = `phone:${phone}`;

      otpStore.set(key, {
        otp: phoneOtp,
        expires,
        verified: false,
      });

      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          route: "q",
          message: `Your Kavas OTP is ${phoneOtp}. Valid for 5 minutes.`,
          language: "english",
          numbers: phone,
        },
        {
          headers: {
            authorization: "qaiITA74c3pkzY1HPJmNWtRMGxoDjefdwulE2QsKXUhCbB9yrS4zEjMDpnmBy92iVqd5uCK83JNakgts",
          },
        }
      );

      console.log("PHONE OTP SENT:", key, phoneOtp);
    }

    // ================= EMAIL OTP =================
    if (email) {
      const emailOtp = Math.floor(100000 + Math.random() * 900000);
      const key = `email:${email}`;

      otpStore.set(key, {
        otp: emailOtp,
        expires,
        verified: false,
      });

      await sendEmailOtp(email, emailOtp);

      console.log("EMAIL OTP SENT:", key, emailOtp);
    }

    return res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let { email, phone, otp } = req.body;

    otp = otp ? String(otp).trim() : null;

    // ================= EMAIL VERIFY =================
    if (email) {
      const key = `email:${email}`;
      const emailData = otpStore.get(key);

      if (!emailData) {
        return res.status(400).json({ message: "Email OTP not found" });
      }

      if (Date.now() > emailData.expires) {
        return res.status(400).json({ message: "Email OTP expired" });
      }

      if (String(emailData.otp) !== String(otp)) {
        return res.status(400).json({ message: "Invalid email OTP" });
      }

      emailData.verified = true;
      otpStore.set(key, emailData);
    }

    // ================= PHONE VERIFY =================
    if (phone) {
      const key = `phone:${phone}`;
      const phoneData = otpStore.get(key);

      if (!phoneData) {
        return res.status(400).json({ message: "Phone OTP not found" });
      }

      if (Date.now() > phoneData.expires) {
        return res.status(400).json({ message: "Phone OTP expired" });
      }

      if (String(phoneData.otp) !== String(otp)) {
        return res.status(400).json({ message: "Invalid phone OTP" });
      }

      phoneData.verified = true;
      otpStore.set(key, phoneData);
    }

    return res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const registerVendor = async (req, res) => {
  const client = await db.connect();

  try {
    const { email, phone, password, confirmPassword } = req.body;

    if (!password || password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ================= EMAIL OTP CHECK =================
    if (email) {
      const emailKey = `email:${email}`;
      const emailData = otpStore.get(emailKey);

      if (!emailData?.verified) {
        return res.status(400).json({ message: "Email OTP not verified" });
      }
    }

    // ================= PHONE OTP CHECK =================
    if (phone) {
      const phoneKey = `phone:${phone}`;
      const phoneData = otpStore.get(phoneKey);

      if (!phoneData?.verified) {
        return res.status(400).json({ message: "Phone OTP not verified" });
      }
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendorResult = await client.query(
      `INSERT INTO vendorprofile (
        email, phone, password_hash, email_verified, phone_verified
      )
      VALUES ($1, $2, $3, true, true)
      RETURNING id`,
      [email, phone, hashedPassword]
    );

    const vendorId = vendorResult.rows[0].id;

    const onboarding = await client.query(
      `INSERT INTO vendor_onboarding (vendor_id, status)
       VALUES ($1, 'draft')
       RETURNING id`,
      [vendorId]
    );

    await client.query("COMMIT");

    // cleanup OTPs
    otpStore.delete(`email:${email}`);
    otpStore.delete(`phone:${phone}`);

    return res.json({
      message: "Registered successfully",
      onboarding_id: onboarding.rows[0].id,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Registration failed" });
  } finally {
    client.release();
  }
};

// export const loginVendor = async (req, res) => {
//   try {
//     const { email, phone, password } = req.body;

//     if (!password || (!email && !phone)) {
//       return res.status(400).json({
//         message: "Email or phone and password required",
//       });
//     }

//     let query;
//     let values;
//     if (email) {
//       query = `
//         SELECT 
//           vp.*, 
//           vo.id as onboarding_id, 
//           vo.status, 
//           vo.current_step,
//           vo.rejection_reason
//         FROM vendorprofile vp
//         LEFT JOIN vendor_onboarding vo ON vo.vendor_id = vp.id
//         WHERE LOWER(vp.email) = LOWER($1)
//       `;
//       values = [email];
//     } 
//     else {
//       query = `
//         SELECT 
//           vp.*, 
//           vo.id as onboarding_id, 
//           vo.status, 
//           vo.current_step,
//           vo.rejection_reason
//         FROM vendorprofile vp
//         LEFT JOIN vendor_onboarding vo ON vo.vendor_id = vp.id
//         WHERE vp.phone = $1
//       `;
//       values = [phone];
//     }

//     const result = await db.query(query, values);

//     if (!result.rows.length) {
//       return res.status(400).json({ message: "Vendor not found" });
//     }

//     const vendor = result.rows[0];

//     if (!vendor.is_active) {
//       return res.status(403).json({ message: "Account disabled" });
//     }

//     const isMatch = await bcrypt.compare(password, vendor.password_hash);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     if (!vendor.email_verified || !vendor.phone_verified) {
//       return res.status(403).json({
//         message: "Please verify email and phone before login",
//       });
//     }

//     await db.query(
//       `UPDATE vendorprofile SET last_login = NOW() WHERE id = $1`,
//       [vendor.id]
//     );

//     let next_action = "dashboard";
//     let onboarding_step = vendor.current_step || 1;

//     if (!vendor.onboarding_id) {
//       next_action = "onboarding";
//       onboarding_step = 1;
//     }
//     else if (vendor.status === "draft") {
//       next_action = "onboarding";
//     }
//     else if (vendor.status === "submitted") {
//       return res.status(403).json({
//         message: "Your application is under review. Admin approval required.",
//         status: "submitted",
//       });
//     }
//     else if (vendor.status === "rejected") {
//       next_action = "onboarding";
//     }
//     else if (vendor.status === "approved") {
//       next_action = "dashboard";
//     }

//     const token = generateToken({
//       vendor_id: vendor.id,
//       onboarding_id: vendor.onboarding_id,
//     });

//     return res.json({
//       message: "Login successful",
//       token,
//       next_action,
//       onboarding_step,
//       status: vendor.status,
//       rejection_reason: vendor.rejection_reason || null,
//       vendor: {
//         id: vendor.id,
//         email: vendor.email,
//         phone: vendor.phone,
//       },
//     });

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     return res.status(500).json({ message: "Login failed" });
//   }
// };
export const loginVendor = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "Email or phone and password required",
      });
    }

    let query, values;

    if (email) {
      query = `
        SELECT vp.*, vo.id as onboarding_id, vo.status, vo.current_step, vo.rejection_reason
        FROM vendorprofile vp
        LEFT JOIN vendor_onboarding vo ON vo.vendor_id = vp.id
        WHERE LOWER(vp.email) = LOWER($1)
      `;
      values = [email];
    } else {
      query = `
        SELECT vp.*, vo.id as onboarding_id, vo.status, vo.current_step, vo.rejection_reason
        FROM vendorprofile vp
        LEFT JOIN vendor_onboarding vo ON vo.vendor_id = vp.id
        WHERE vp.phone = $1
      `;
      values = [phone];
    }

    const result = await db.query(query, values);

    if (!result.rows.length) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    const vendor = result.rows[0];

    if (!vendor.is_active) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!vendor.email_verified || !vendor.phone_verified) {
      return res.status(403).json({
        message: "Verify email & phone first",
      });
    }

    // ✅ Update last login
    await db.query(
      `UPDATE vendorprofile SET last_login = NOW() WHERE id = $1`,
      [vendor.id]
    );

    /* ================= FLOW ================= */

    let next_action = "dashboard";
    let onboarding_step = vendor.current_step || 1;

    if (!vendor.onboarding_id) {
      next_action = "onboarding";
      onboarding_step = 1;
    } else if (vendor.status === "draft") {
      next_action = "onboarding";
    } else if (vendor.status === "submitted") {
      return res.status(403).json({
        message: "Application under review",
        status: "submitted",
      });
    } else if (vendor.status === "rejected") {
      next_action = "onboarding";
    }

    /* ================= TOKENS ================= */

    const accessToken = generateToken({
      vendor_id: vendor.id,
      onboarding_id: vendor.onboarding_id,
    });

    const refreshToken = randomBytes(64).toString("hex");

    // ✅ Store session
    await db.query(
      `INSERT INTO vendor_sessions 
       (vendor_id, refresh_token, user_agent, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
      [
        vendor.id,
        refreshToken,
        req.headers["user-agent"] || null,
        req.ip || null,
      ]
    );

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      next_action,
      onboarding_step,
      status: vendor.status,
      rejection_reason: vendor.rejection_reason || null,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        phone: vendor.phone,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const session = await db.query(
      `SELECT vendor_id FROM vendor_sessions 
       WHERE refresh_token = $1 AND expires_at > NOW()`,
      [refreshToken]
    );

    if (!session.rows.length) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const vendor_id = session.rows[0].vendor_id;

    const accessToken = generateAccessToken({ vendor_id });

    return res.json({
      accessToken,
      vendor: { id: vendor_id } // 👈 IMPORTANT
    });

  } catch (err) {
    return res.status(500).json({ message: "Refresh failed" });
  }
};

// export const logoutVendor = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(400).json({ message: "Token missing" });
//     }

//     // decode token to get expiry
//     const decoded = jwt.decode(token);

//     await db.query(
//       `INSERT INTO token_blacklist (token, expires_at)
//        VALUES ($1, to_timestamp($2))`,
//       [token, decoded.exp]
//     );

//     return res.json({ message: "Logged out successfully" });

//   } catch (err) {
//     console.error("LOGOUT ERROR:", err);
//     return res.status(500).json({ message: "Logout failed" });
//   }
// };
export const logoutVendor = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // ✅ Delete session
    await db.query(
      `DELETE FROM vendor_sessions WHERE refresh_token = $1`,
      [refreshToken]
    );

    return res.json({ message: "Logged out successfully" });

  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const getVendorProfile = async (req, res) => {
  const { id } = req.params;

  const result = await db.query(
    `SELECT email_verified, phone_verified FROM vendorprofile WHERE id = $1`,
    [id]
  );

  res.json(result.rows[0]);
};

export const upsertBusinessDetails = async (req, res) => {
  try {
    const onboarding_id = req.user?.onboarding_id; // assume auth middleware
    const {
      business_name,
      business_type,
      registered_name,
      pan,
      gstin,
      registration_number,
      address,
      pincode,
      city,
      state,
    } = req.body;

    if (!onboarding_id) {
      return res.status(400).json({ message: "Onboarding ID missing" });
    }

    // basic validation (don’t rely only on frontend)
    if (!business_name || !business_type || !pan || !address) {
      return res.status(400).json({
        message: "Required business fields missing",
      });
    }

    const query = `
      INSERT INTO vendor_business_details (
        onboarding_id,
        business_name,
        business_type,
        registered_name,
        pan,
        gstin,
        registration_number,
        address,
        pincode,
        city,
        state
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (onboarding_id)
      DO UPDATE SET
        business_name = EXCLUDED.business_name,
        business_type = EXCLUDED.business_type,
        registered_name = EXCLUDED.registered_name,
        pan = EXCLUDED.pan,
        gstin = EXCLUDED.gstin,
        registration_number = EXCLUDED.registration_number,
        address = EXCLUDED.address,
        pincode = EXCLUDED.pincode,
        city = EXCLUDED.city,
        state = EXCLUDED.state
      RETURNING *;
    `;

    const values = [
      onboarding_id,
      business_name,
      business_type,
      registered_name,
      pan,
      gstin,
      registration_number,
      address,
      pincode,
      city,
      state,
    ];

    const result = await db.query(query, values);

    return res.status(200).json({
      message: "Business details saved",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Business Details Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBusinessDetails = async (req, res) => {
  try {
    const onboarding_id = req.user?.onboarding_id;

    const result = await db.query(
      `SELECT * FROM vendor_business_details WHERE onboarding_id = $1`,
      [onboarding_id]
    );

    return res.json(result.rows[0] || null);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const upsertBankDetails = async (req, res) => {
  try {
    const onboarding_id = req.user?.onboarding_id;
    const {
      account_holder_name,
      account_number,
      ifsc_code,
    } = req.body;

    if (!onboarding_id) {
      return res.status(400).json({ message: "Onboarding ID missing" });
    }

    if (!account_holder_name || !account_number || !ifsc_code) {
      return res.status(400).json({
        message: "Required bank details missing",
      });
    }

    const query = `
      INSERT INTO vendor_bank_details (
        onboarding_id,
        account_holder_name,
        account_number,
        ifsc_code
      )
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (onboarding_id)
      DO UPDATE SET
        account_holder_name = EXCLUDED.account_holder_name,
        account_number = EXCLUDED.account_number,
        ifsc_code = EXCLUDED.ifsc_code
      RETURNING *;
    `;

    const values = [
      onboarding_id,
      account_holder_name,
      account_number,
      ifsc_code,
    ];

    const result = await db.query(query, values);

    return res.status(200).json({
      message: "Bank details saved",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Bank Details Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBankDetails = async (req, res) => {
  try {
    const onboarding_id = req.user?.onboarding_id;

    const result = await db.query(
      `SELECT * FROM vendor_bank_details WHERE onboarding_id = $1`,
      [onboarding_id]
    );

    return res.json(result.rows[0] || null);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateOnboardingStep = async (req, res) => {
  try {
    const vendor_id = req.user?.vendor_id;

    const { step } = req.body;

    if (!vendor_id) {
      return res.status(400).json({ message: "Vendor missing" });
    }

    const result = await db.query(
      `
      UPDATE vendor_onboarding
      SET current_step = $1,
          updated_at = NOW()
      WHERE vendor_id = $2
      RETURNING *
      `,
      [step, vendor_id]
    );

    return res.json({
      message: "Step updated",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOnboardingState = async (req, res) => {
  try {
    const vendor_id = req.user?.vendor_id;

    const result = await db.query(
      `
      SELECT current_step, status
      FROM vendor_onboarding
      WHERE vendor_id = $1
      `,
      [vendor_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Onboarding not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};