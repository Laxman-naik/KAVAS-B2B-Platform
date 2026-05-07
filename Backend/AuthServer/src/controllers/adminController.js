const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const redis = require("../config/redis");

const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const result = await pool.query(
      "SELECT * FROM admins WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    await redis.set(
      `admin_refresh:${admin.id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    return res.json({
      message: "Login success",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const storedToken = await redis.get(`admin_refresh:${decoded.id}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      accessToken: newAccessToken,
    });

  } catch (err) {
    return res.status(401).json({ message: "Session expired" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      await redis.del(`admin_refresh:${decoded.id}`);
    }
  } catch (err) {
    console.log("Logout error:", err.message);
  }

  return res.json({ message: "Logged out" });
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, role FROM admins WHERE id=$1",
      [req.user.id]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({ user: null });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
    );

    return res.json({
      users: result.rows,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
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
  try {
    const { onboarding_id, status } = req.body;

    if (!onboarding_id) {
      return res.status(400).json({ message: "onboarding_id is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    // 1. Get onboarding data first
    const onboardingRes = await pool.query(
      `SELECT * FROM vendor_onboarding WHERE id = $1`,
      [onboarding_id]
    );

    if (onboardingRes.rowCount === 0) {
      return res.status(404).json({ message: "Vendor onboarding not found" });
    }

    const onboarding = onboardingRes.rows[0];

    let organization_id = onboarding.organization_id;

    // 2. CREATE ORGANIZATION ONLY IF APPROVED
    if (status === "approved" && !organization_id) {
      const orgRes = await pool.query(
        `INSERT INTO organizations (name, type)
         VALUES ($1, 'both')
         RETURNING id`,
        [onboarding.business_name]
      );

      organization_id = orgRes.rows[0].id;
    }

    // 3. UPDATE ONBOARDING
    const result = await pool.query(
      `
      UPDATE vendor_onboarding
      SET 
        status = $2,
        organization_id = COALESCE($3, organization_id),
        reviewed_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [onboarding_id, status, organization_id]
    );

    return res.json({
      message: `Vendor status updated to ${status}`,
      data: result.rows[0],
      organization_id,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err,
    });
  }
};

const rejectVendor = async (req, res) => {
  try {
    const { onboarding_id, reason } = req.body;

    await pool.query(`
      UPDATE vendor_onboarding
      SET 
        status = 'rejected',
        rejection_reason = $2,
        reviewed_at = NOW()
      WHERE id = $1
    `, [onboarding_id, reason]);

    return res.json({ message: "Vendor rejected" });

  } catch (err) {
    return res.status(500).json({ message: "Error rejecting vendor" });
  }
};

module.exports = { login, refreshTokenHandler, logout, getMe, getAllUsers, getAllOnboardingVendors, approveVendor, rejectVendor};