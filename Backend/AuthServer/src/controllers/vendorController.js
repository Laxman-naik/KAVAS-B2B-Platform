import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import axios from "axios";
import { sendEmailOtp } from "../utils/emailService.js";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt.js";

const otpStore = new Map();

// export const sendOtp = async (req, res) => {
//   try {
//     const { email, phone } = req.body;

//     if (!email && !phone) {
//       return res.status(400).json({ message: "Email or phone required" });
//     }

//     const expires = Date.now() + 5 * 60 * 1000;

//     // ================= PHONE OTP =================
//     if (phone) {
//       const phoneOtp = Math.floor(100000 + Math.random() * 900000);
//       const key = `phone:${phone}`;

//       otpStore.set(key, {
//         otp: phoneOtp,
//         expires,
//         verified: false,
//       });

//       await axios.post(
//         "https://www.fast2sms.com/dev/bulkV2",
//         {
//           route: "q",
//           message: `Your Kavas OTP is ${phoneOtp}. Valid for 5 minutes.`,
//           language: "english",
//           numbers: phone,
//         },
//         {
//           headers: {
//             authorization: "qaiITA74c3pkzY1HPJmNWtRMGxoDjefdwulE2QsKXUhCbB9yrS4zEjMDpnmBy92iVqd5uCK83JNakgts",
//           },
//         }
//       );

//       console.log("PHONE OTP SENT:", key, phoneOtp);
//     }

//     // ================= EMAIL OTP =================
//     if (email) {
//       const emailOtp = Math.floor(100000 + Math.random() * 900000);
//       const key = `email:${email}`;

//       otpStore.set(key, {
//         otp: emailOtp,
//         expires,
//         verified: false,
//       });

//       try {
//   const info = await sendEmailOtp(email, emailOtp);
//   console.log("EMAIL SENT:", info.messageId);
//   emailSent = true;
// } catch (err) {
//   console.error("EMAIL FAILED FULL:", err);
//   emailSent = false;
// }

//       console.log("EMAIL OTP SENT:", key, emailOtp);
//     }

//     return res.json({ message: "OTP sent successfully" });

//   } catch (err) {
//     console.error("SEND OTP ERROR:", err);
//     return res.status(500).json({ message: err });
//   }
// };
export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const expires = Date.now() + 5 * 60 * 1000;

    let emailSent = false;
    let phoneSent = false;

    // ================= PHONE OTP =================
    if (phone) {
      const phoneOtp = Math.floor(100000 + Math.random() * 900000);
      const key = `phone:${phone}`;

      otpStore.set(key, {
        otp: phoneOtp,
        expires,
        verified: false,
      });

      try {
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

        phoneSent = true;
      } catch (smsErr) {
        console.error("SMS FAILED FULL:", smsErr);
      }

      console.log("PHONE OTP GENERATED:", key, phoneOtp);
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

      try {
        const info = await sendEmailOtp(email, emailOtp);
        console.log("EMAIL SENT:", info.messageId);
        emailSent = true;
      } catch (err) {
        console.error("EMAIL FAILED FULL:", err);
      }

      console.log("EMAIL OTP GENERATED:", key, emailOtp);
    }

    return res.status(200).json({
      message: "OTP process completed",
      emailSent,
      phoneSent,
    });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);

    return res.status(500).json({
      message: err.message || "Internal server error",
    });
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
    return res.status(500).json({ message: err });
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

    // ✅ check active
    if (!vendor.is_active) {
      return res.status(403).json({ message: "Account disabled" });
    }

    // ✅ password check
    const isMatch = await bcrypt.compare(password, vendor.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // optional: verify email/phone
    if (!vendor.email_verified || !vendor.phone_verified) {
      return res.status(403).json({
        message: "Verify email & phone first",
      });
    }

    // ✅ update last login
    await db.query(
      `UPDATE vendorprofile SET last_login = NOW() WHERE id = $1`,
      [vendor.id]
    );

    /* ================= ONBOARDING FLOW ================= */

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
      onboarding_step = 1;
    }

    /* ================= TOKENS ================= */

    // 🔥 ACCESS TOKEN (short life)
    const accessToken = jwt.sign(
      {
        vendor_id: vendor.id,
        onboarding_id: vendor.onboarding_id,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "60m" }
    );

    // 🔥 REFRESH TOKEN (secure JWT instead of random string)
    const refreshToken = jwt.sign(
      {
        vendor_id: vendor.id,
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ store session
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
      role:"vendoe",
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
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // 1. verify JWT refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded?.vendor_id) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // 2. check session in DB (STRICT validation)
    const session = await db.query(
      `SELECT * FROM sessions 
       WHERE refresh_token = $1 
         AND user_id = $2 
         AND expires_at > NOW()
         AND is_revoked = false`,
      [refreshToken, decoded.vendor_id]
    );

    if (!session.rows.length) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const currentSession = session.rows[0];

    // 3. generate new access token
    const accessToken = generateAccessToken({
      vendor_id: decoded.vendor_id,
    });

    // 4. OPTIONAL BUT IMPORTANT → rotate refresh token (security upgrade)
    const newRefreshToken = generateRefreshToken({
      vendor_id: decoded.vendor_id,
    });

    // 5. update session (rotation + tracking)
    await db.query(
      `UPDATE sessions
       SET refresh_token = $1,
           last_used_at = NOW()
       WHERE id = $2`,
      [newRefreshToken, currentSession.id]
    );

    return res.json({
      accessToken,
      refreshToken: newRefreshToken, // send updated token
    });

  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(401).json({ message: "Refresh failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const vendorId = req.user.vendor_id;

    const result = await db.query(
      `SELECT vp.id, vp.email, vp.phone, vp.email_verified, vp.phone_verified, vp.is_active,
              vo.id as onboarding_id, vo.status, vo.current_step
       FROM vendorprofile vp
       LEFT JOIN vendor_onboarding vo ON vo.vendor_id = vp.id
       WHERE vp.id = $1`,
      [vendorId]
    );

    const vendor = result.rows[0];

    // Get business and bank details
    const businessResult = await db.query(
      `SELECT * FROM vendor_business_details WHERE onboarding_id = $1`,
      [vendor.onboarding_id]
    );

    const bankResult = await db.query(
      `SELECT * FROM vendor_bank_details WHERE onboarding_id = $1`,
      [vendor.onboarding_id]
    );

    return res.json({
      vendor: vendor,
      onboarding: {
        id: vendor.onboarding_id,
        current_step: vendor.current_step,
        status: vendor.status,
      },
      business: businessResult.rows[0] || null,
      bank: bankResult.rows[0] || null,
    });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

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
    console.log("👉 BUSINESS DETAILS REQUEST - user:", req.user);
    console.log("👉 BUSINESS DETAILS REQUEST - body:", req.body);

    const onboarding_id = req.user?.onboarding_id;

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

    // 🔴 HARD FAIL if onboarding missing
    if (!onboarding_id) {
      return res.status(400).json({
        message: "Onboarding ID missing (auth issue)",
      });
    }

    // 🔴 VALIDATION
    if (!business_name || !business_type || !pan || !address) {
      return res.status(400).json({
        message: "Required business fields missing",
      });
    }

    // ✅ UPSERT QUERY (FIXED)
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
      ON CONFLICT ON CONSTRAINT unique_business_onboarding_id
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
      registered_name || null,
      pan,
      gstin || null,
      registration_number || null,
      address,
      pincode || null,
      city || null,
      state || null,
    ];

    const result = await db.query(query, values);

    console.log("✅ BUSINESS UPSERT SUCCESS:", result.rows[0]);

    return res.status(200).json({
      message: "Business details saved",
      data: result.rows[0],
    });

  } catch (err) {
    console.error("❌ Business Details Error FULL:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
      code: err.code,
    });
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
    return res.status(500).json({ message: err });
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

export const upsertStoreAndPickup = async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const onboarding_id = req.user?.onboarding_id;

    if (!onboarding_id) {
      return res.status(400).json({
        message: "Onboarding ID missing",
      });
    }

    const {
      store_image,
      store_logo,
      tagline,
      description,
      address,
      pincode,
      city,
      state,
      is_store_address = true,
    } = req.body;

    if (!address || !pincode || !city || !state) {
      return res.status(400).json({
        message: "Pickup address fields are required",
      });
    }

    // STORE
    const storeResult = await client.query(
      `INSERT INTO vendor_store_details (
        onboarding_id, store_image, store_logo, tagline, description
      )
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (onboarding_id)
      DO UPDATE SET
        store_image = EXCLUDED.store_image,
        store_logo = EXCLUDED.store_logo,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description
      RETURNING *;`,
      [
        onboarding_id,
        store_image || null,
        store_logo || null,
        tagline || null,
        description || null,
      ]
    );

    // PICKUP
    const pickupResult = await client.query(
      `INSERT INTO vendor_pickup_addresses (
        onboarding_id, address, pincode, city, state, is_store_address
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (onboarding_id)
      DO UPDATE SET
        address = EXCLUDED.address,
        pincode = EXCLUDED.pincode,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        is_store_address = EXCLUDED.is_store_address
      RETURNING *;`,
      [onboarding_id, address, pincode, city, state, is_store_address]
    );

    // 🔥 ONBOARDING UPDATE (CORRECT WAY)
    await client.query(
      `UPDATE vendor_onboarding
       SET 
         current_step = 3,
         status = 'in_review',
         submitted_at = NOW(),
         updated_at = NOW()
       WHERE id = $1`,
      [onboarding_id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Store & pickup details saved successfully",
      data: {
        store: storeResult.rows[0],
        pickup: pickupResult.rows[0],
      },
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

export const getStoreAndPickup = async (req, res) => {
  try {
    const onboarding_id = req.user?.onboarding_id;

    if (!onboarding_id) {
      return res.status(400).json({
        message: "Onboarding ID missing",
      });
    }

    const storeQuery = `
      SELECT * FROM vendor_store_details
      WHERE onboarding_id = $1
    `;

    const pickupQuery = `
      SELECT * FROM vendor_pickup_addresses
      WHERE onboarding_id = $1
    `;

    const [storeResult, pickupResult] = await Promise.all([
      db.query(storeQuery, [onboarding_id]),
      db.query(pickupQuery, [onboarding_id]),
    ]);

    return res.status(200).json({
      store: storeResult.rows[0] || null,
      pickup: pickupResult.rows[0] || null,
    });

  } catch (err) {
    console.error("Fetch Store + Pickup Error:", err);
    return res.status(500).json({
      message: "Server error",
    });
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
