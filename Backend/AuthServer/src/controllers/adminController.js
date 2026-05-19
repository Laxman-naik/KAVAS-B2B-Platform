// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const pool = require("../config/db");
// const redis = require("../config/redis");

// const generateAccessToken = (admin) => {
//   return jwt.sign(
//     { id: admin.id, role: admin.role },
//     process.env.ACCESS_SECRET,
//     { expiresIn: "15m" }
//   );
// };

// const generateRefreshToken = (admin) => {
//   return jwt.sign(
//     { id: admin.id },
//     process.env.REFRESH_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Missing credentials" });
//     }

//     const result = await pool.query(
//       "SELECT * FROM admins WHERE email=$1",
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid email" });
//     }

//     const admin = result.rows[0];

//     const isMatch = await bcrypt.compare(password, admin.password_hash);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const accessToken = generateAccessToken(admin);
//     const refreshToken = generateRefreshToken(admin);

//     await redis.set(
//       `admin_refresh:${admin.id}`,
//       refreshToken,
//       "EX",
//       7 * 24 * 60 * 60
//     );

//     return res.json({
//       message: "Login success",
//       user: {
//         id: admin.id,
//         email: admin.email,
//         role: admin.role,
//       },
//       accessToken,
//       refreshToken,
//     });

//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// const refreshTokenHandler = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(401).json({ message: "No refresh token" });
//     }

//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

//     const storedToken = await redis.get(`admin_refresh:${decoded.id}`);

//     if (!storedToken || storedToken !== refreshToken) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     const newAccessToken = jwt.sign(
//       { id: decoded.id, role: "admin" },
//       process.env.ACCESS_SECRET,
//       { expiresIn: "15m" }
//     );

//     return res.json({
//       accessToken: newAccessToken,
//     });

//   } catch (err) {
//     return res.status(401).json({ message: "Session expired" });
//   }
// };

// const logout = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (refreshToken) {
//       const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
//       await redis.del(`admin_refresh:${decoded.id}`);
//     }
//   } catch (err) {
//     console.log("Logout error:", err.message);
//   }

//   return res.json({ message: "Logged out" });
// };

// const getMe = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, full_name, email, role FROM admins WHERE id=$1",
//       [req.user.id]
//     );

//     return res.json({ user: result.rows[0] });
//   } catch (err) {
//     console.error("GET ME ERROR:", err);
//     return res.status(500).json({ user: null });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
//     );

//     return res.json({
//       users: result.rows,
//     });
//   } catch (err) {
//     console.error("GET USERS ERROR:", err);
//     return res.status(500).json({ message: "Failed to fetch users" });
//   }
// };

// const getAllOnboardingVendors = async (req, res) => {
//   try {
//     const query = `
//       SELECT 
//         vo.id AS onboarding_id,
//         vo.status,
//         vo.current_step,
//         vo.submitted_at,
//         vo.created_at,
//         vo.rejection_reason,

//         vp.id AS vendor_id,
//         vp.email,
//         vp.phone,
//         vp.email_verified,
//         vp.phone_verified,
//         vp.is_active,

//         vb.business_name,
//         vb.business_type,
//         vb.registered_name,
//         vb.pan,
//         vb.gstin,
//         vb.registration_number,
//         vb.address AS business_address,
//         vb.city,
//         vb.state,
//         vb.pincode,

//         bk.account_holder_name,
//         bk.account_number,
//         bk.ifsc_code,
//         bk.verified AS bank_verified,

//         vs.store_image,
//         vs.store_logo,
//         vs.tagline,
//         vs.description,

//         pa.address AS pickup_address,
//         pa.city AS pickup_city,
//         pa.state AS pickup_state,
//         pa.pincode AS pickup_pincode,
//         pa.is_store_address

//       FROM vendor_onboarding vo

//       LEFT JOIN vendorprofile vp 
//         ON vp.id = vo.vendor_id

//       LEFT JOIN vendor_business_details vb 
//         ON vb.onboarding_id = vo.id

//       LEFT JOIN vendor_bank_details bk 
//         ON bk.onboarding_id = vo.id

//       LEFT JOIN vendor_store_details vs 
//         ON vs.onboarding_id = vo.id

//       LEFT JOIN vendor_pickup_addresses pa 
//         ON pa.onboarding_id = vo.id

//       ORDER BY vo.created_at DESC;
//     `;

//     const result = await pool.query(query);

//     return res.status(200).json({
//       message: "All onboarding vendors fetched successfully",
//       data: result.rows,
//     });

//   } catch (err) {
//     console.error("Admin Fetch Error:", err);

//     return res.status(500).json({
//       message: err.message,
//       error: err.code || null,
//     });
//   }
// };

// const approveVendor = async (req, res) => {
//   try {
//     const { onboarding_id, status } = req.body;

//     if (!onboarding_id) {
//       return res.status(400).json({ message: "onboarding_id is required" });
//     }

//     if (!status) {
//       return res.status(400).json({ message: "status is required" });
//     }

//     // 1. Get onboarding
//     const onboardingRes = await pool.query(
//       `SELECT * FROM vendor_onboarding WHERE id = $1`,
//       [onboarding_id]
//     );

//     if (onboardingRes.rowCount === 0) {
//       return res.status(404).json({ message: "Vendor onboarding not found" });
//     }

//     const onboarding = onboardingRes.rows[0];

//     let organization_id = onboarding.organization_id;

//     // 2. Fetch BUSINESS DETAILS (IMPORTANT FIX)
//     const businessRes = await pool.query(
//       `SELECT * FROM vendor_business_details WHERE onboarding_id = $1`,
//       [onboarding_id]
//     );

//     if (businessRes.rowCount === 0) {
//       return res.status(400).json({
//         message: "Business details not found for this onboarding"
//       });
//     }

//     const business = businessRes.rows[0];

//     // 3. CREATE ORGANIZATION ONLY WHEN APPROVED
//     if (status === "approved" && !organization_id) {

//       if (!business.business_name || !business.business_type) {
//         return res.status(400).json({
//           message: "Missing business_name or business_type in business details"
//         });
//       }

//       const orgRes = await pool.query(
//         `
//         INSERT INTO organizations (name, business_type)
//         VALUES ($1, $2)
//         RETURNING id
//         `,
//         [
//           business.business_name,
//           business.business_type
//         ]
//       );

//       organization_id = orgRes.rows[0].id;

//       // 3a. CREATE VENDOR RECORD IN VENDORS TABLE
//       const vendorRes = await pool.query(
//         `
//         INSERT INTO vendors (user_id, organization_id, onboarding_id, status, is_live, approved_at, approved_by)
//         VALUES ($1, $2, $3, $4, $5, NOW(), $6)
//         RETURNING id
//         `,
//         [
//           onboarding.vendor_id,  // user_id from vendor_onboarding
//           organization_id,
//           onboarding_id,
//           'active',  // status in vendors table
//           true,        // is_live
//           req.user?.id, // approved_by (admin who approved)
//         ]
//       );

//       console.log("✅ VENDOR RECORD CREATED:", vendorRes.rows[0].id);
//     }

//     // 4. UPDATE onboarding
//     const updated = await pool.query(
//       `
//       UPDATE vendor_onboarding
//       SET 
//         status = $2,
//         organization_id = COALESCE($3, organization_id),
//         reviewed_at = NOW()
//       WHERE id = $1
//       RETURNING *
//       `,
//       [onboarding_id, status, organization_id]
//     );

//     return res.json({
//       message: `Vendor status updated to ${status}`,
//       organization_id,
//       data: updated.rows[0]
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: err,
//       error: err.message
//     });
//   }
// };

// const rejectVendor = async (req, res) => {
//   try {
//     const { onboarding_id, reason } = req.body;

//     await pool.query(`
//       UPDATE vendor_onboarding
//       SET 
//         status = 'rejected',
//         rejection_reason = $2,
//         reviewed_at = NOW()
//       WHERE id = $1
//     `, [onboarding_id, reason]);

//     return res.json({ message: "Vendor rejected" });

//   } catch (err) {
//     return res.status(500).json({ message: "Error rejecting vendor" });
//   }
// };

// module.exports = { login, refreshTokenHandler, logout, getMe, getAllUsers, getAllOnboardingVendors, approveVendor, rejectVendor};


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = () => {
  return jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const { rows } = await pool.query(
      "SELECT * FROM admins WHERE email=$1",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken();

    const sessionId = uuidv4();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    /* ✅ FIX: admin_sessions (NOT sessions) */
    await pool.query(
      `INSERT INTO admin_sessions
      (session_id, admin_id, refresh_token, ip_address, user_agent, expires_at)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        sessionId,
        admin.id,
        refreshToken,
        req.ip,
        req.headers["user-agent"],
        expiresAt,
      ]
    );

    return res.json({
      message: "Login success",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      role: admin.role,
      accessToken,
      refreshToken,
      sessionId,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken, sessionId } = req.body;

    if (!(refreshToken && sessionId)) {
      return res.status(401).json({ message: "Missing refresh data" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    /* ✅ FIX: admin_sessions */
    const sessionRes = await pool.query(
      `SELECT * FROM admin_sessions
       WHERE session_id=$1
       AND refresh_token=$2
       AND is_revoked=false
       AND expires_at > NOW()`,
      [sessionId, refreshToken]
    );

    if (!sessionRes.rows.length) {
      return res.status(403).json({ message: "Session not valid" });
    }

    const session = sessionRes.rows[0];

    const adminRes = await pool.query(
      "SELECT * FROM admins WHERE id=$1",
      [session.admin_id]
    );

    const admin = adminRes.rows[0];

    const newAccessToken = generateAccessToken(admin);

    await pool.query(
      `UPDATE admin_sessions
       SET last_used_at = NOW()
       WHERE session_id = $1`,
      [sessionId]
    );

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(500).json({ message: "Refresh failed" });
  }
};

const logout = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId required" });
    }

    /* ✅ FIX: revoke admin session */
    await pool.query(
      `UPDATE admin_sessions
       SET is_revoked = true
       WHERE session_id = $1`,
      [sessionId]
    );

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, role FROM admins WHERE id=$1",
      [req.user.id]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ user: null });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
    );

    return res.json({ users: result.rows });
  } catch (err) {
    return res.status(500).json({ message: "Failed" });
  }
};

const getAllOnboardingVendors = async (req, res) => {
  try {
    const query = `
      SELECT 
        vo.id AS onboarding_id,
        vo.status,
        vo.current_step,
        vo.submitted_at,
        vo.created_at,
        vo.rejection_reason,

        vp.id AS vendor_id,
        vp.email,
        vp.phone,
        vp.email_verified,
        vp.phone_verified,
        vp.is_active,

        vb.business_name,
        vb.business_type,
        vb.registered_name,
        vb.pan,
        vb.gstin,
        vb.registration_number,
        vb.address AS business_address,
        vb.city,
        vb.state,
        vb.pincode,

        bk.account_holder_name,
        bk.account_number,
        bk.ifsc_code,
        bk.verified AS bank_verified,

        vs.store_image,
        vs.store_logo,
        vs.tagline,
        vs.description,

        pa.address AS pickup_address,
        pa.city AS pickup_city,
        pa.state AS pickup_state,
        pa.pincode AS pickup_pincode,
        pa.is_store_address

      FROM vendor_onboarding vo

      LEFT JOIN vendorprofile vp 
        ON vp.id = vo.vendor_id

      LEFT JOIN vendor_business_details vb 
        ON vb.onboarding_id = vo.id

      LEFT JOIN vendor_bank_details bk 
        ON bk.onboarding_id = vo.id

      LEFT JOIN vendor_store_details vs 
        ON vs.onboarding_id = vo.id

      LEFT JOIN vendor_pickup_addresses pa 
        ON pa.onboarding_id = vo.id

      ORDER BY vo.created_at DESC;
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      message: "All onboarding vendors fetched successfully",
      data: result.rows,
    });

  } catch (err) {
    console.error("Admin Fetch Error:", err);

    return res.status(500).json({
      message: err.message,
      error: err.code || null,
    });
  }
};

const approveVendor = async (req, res) => {
  const client = await pool.connect();

  try {
    const { onboarding_id, status } = req.body;

    await client.query("BEGIN");

    const onboardingRes = await client.query(
      "SELECT * FROM vendor_onboarding WHERE id=$1",
      [onboarding_id]
    );

    if (!onboardingRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Not found" });
    }

    const onboarding = onboardingRes.rows[0];

    const businessRes = await client.query(
      "SELECT * FROM vendor_business_details WHERE onboarding_id=$1",
      [onboarding_id]
    );

    const business = businessRes.rows[0];

    let organization_id = onboarding.organization_id;

    if (status === "approved" && !organization_id) {
      const orgRes = await client.query(
        `INSERT INTO organizations (name, business_type)
         VALUES ($1,$2)
         RETURNING id`,
        [business.business_name, business.business_type]
      );

      organization_id = orgRes.rows[0].id;

      await client.query(
        `INSERT INTO vendors
        (user_id, organization_id, onboarding_id, status, is_live, approved_at, approved_by)
        VALUES ($1,$2,$3,'active',true,NOW(),$4)`,
        [onboarding.vendor_id, organization_id, onboarding_id, req.user.id]
      );
    }

    const updated = await client.query(
      `UPDATE vendor_onboarding
       SET status=$2, organization_id=$3, reviewed_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [onboarding_id, status, organization_id]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Updated",
      data: updated.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const rejectVendor = async (req, res) => {
  try {
    const { onboarding_id, reason } = req.body;

    await pool.query(
      `UPDATE vendor_onboarding
       SET status='rejected', rejection_reason=$2, reviewed_at=NOW()
       WHERE id=$1`,
      [onboarding_id, reason]
    );

    return res.json({ message: "Rejected" });
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
};

module.exports = { login, refreshTokenHandler, logout, getMe, getAllUsers, getAllOnboardingVendors, approveVendor, rejectVendor,};