const pool = require("../config/db");

exports.createAddress = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const {
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO addresses 
      (user_id, address_line1, address_line2, city, state, country, postal_code)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [userId, address_line1, address_line2, city, state, country, postal_code]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await pool.query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const {
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
    } = req.body;

    const result = await pool.query(
      `UPDATE addresses SET
        address_line1=$1,
        address_line2=$2,
        city=$3,
        state=$4,
        country=$5,
        postal_code=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`,
      [
        address_line1,
        address_line2,
        city,
        state,
        country,
        postal_code,
        id,
        userId,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM addresses WHERE id=$1 AND user_id=$2 RETURNING *`,
      [id, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};