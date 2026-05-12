const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

  return decoded.id;
};

const getProfile = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `
      SELECT 
        id,
        full_name,
        email,
        phone,
        avatar_url,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { full_name, phone, avatar_url } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET 
        full_name = COALESCE($1, full_name),
        phone = COALESCE($2, phone),
        avatar_url = COALESCE($3, avatar_url)
      WHERE id = $4
      RETURNING 
        id,
        full_name,
        email,
        phone,
        avatar_url,
        role,
        created_at
      `,
      [full_name, phone, avatar_url, userId]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};