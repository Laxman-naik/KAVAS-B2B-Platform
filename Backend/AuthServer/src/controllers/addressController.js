const pool = require("../config/db");

// exports.createAddress = async (req, res) => {
//   try {
//     const { id: userId } = req.user;

//     const {
//       address_line1,
//       address_line2,
//       city,
//       state,
//       country,
//       postal_code,
//     } = req.body;

//     const result = await pool.query(
//       `INSERT INTO addresses 
//       (user_id, address_line1, address_line2, city, state, country, postal_code)
//       VALUES ($1,$2,$3,$4,$5,$6,$7)
//       RETURNING *`,
//       [userId, address_line1, address_line2, city, state, country, postal_code]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.createAddress = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id: userId } = req.user;

    const {
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
      phone,
      label,
      type,
      is_default,
      active,
    } = req.body;

    await client.query("BEGIN");

    // 🔴 If setting as default → reset others
    if (is_default) {
      await client.query(
        `UPDATE addresses SET is_default = false WHERE user_id = $1`,
        [userId]
      );
    }

    const result = await client.query(
      `INSERT INTO addresses 
      (user_id, address_line1, address_line2, city, state, country, postal_code, phone, label, type, is_default, active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        userId,
        address_line1,
        address_line2,
        city,
        state,
        country,
        postal_code,
        phone || null,
        label || "Address",
        type || "other",
        is_default || false,
        active ?? true,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

// exports.getUserAddresses = async (req, res) => {
//   try {
//     const { id: userId } = req.user;

//     const result = await pool.query(
//       `SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC`,
//       [userId]
//     );

//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getUserAddresses = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await pool.query(
      `SELECT * FROM addresses 
       WHERE user_id = $1 
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.updateAddress = async (req, res) => {
//   try {
//     const { id: userId } = req.user;
//     const { id } = req.params;

//     const {
//       address_line1,
//       address_line2,
//       city,
//       state,
//       country,
//       postal_code,
//     } = req.body;

//     const result = await pool.query(
//       `UPDATE addresses SET
//         address_line1=$1,
//         address_line2=$2,
//         city=$3,
//         state=$4,
//         country=$5,
//         postal_code=$6
//        WHERE id=$7 AND user_id=$8
//        RETURNING *`,
//       [
//         address_line1,
//         address_line2,
//         city,
//         state,
//         country,
//         postal_code,
//         id,
//         userId,
//       ]
//     );

//     if (!result.rows.length) {
//       return res.status(404).json({ message: "Address not found" });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.updateAddress = async (req, res) => {
  const client = await pool.connect();

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
      phone,
      label,
      type,
      is_default,
      active,
    } = req.body;

    await client.query("BEGIN");

    // 🔴 If setting as default → reset others
    if (is_default) {
      await client.query(
        `UPDATE addresses SET is_default = false WHERE user_id = $1`,
        [userId]
      );
    }

    const result = await client.query(
      `UPDATE addresses SET
        address_line1=$1,
        address_line2=$2,
        city=$3,
        state=$4,
        country=$5,
        postal_code=$6,
        phone=$7,
        label=$8,
        type=$9,
        is_default=$10,
        active=$11
       WHERE id=$12 AND user_id=$13
       RETURNING *`,
      [
        address_line1,
        address_line2,
        city,
        state,
        country,
        postal_code,
        phone || null,
        label || "Address",
        type || "other",
        is_default || false,
        active ?? true,
        id,
        userId,
      ]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Address not found" });
    }

    await client.query("COMMIT");

    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

// exports.deleteAddress = async (req, res) => {
//   try {
//     const { id: userId } = req.user;
//     const { id } = req.params;

//     const result = await pool.query(
//       `DELETE FROM addresses WHERE id=$1 AND user_id=$2 RETURNING *`,
//       [id, userId]
//     );

//     if (!result.rows.length) {
//       return res.status(404).json({ message: "Address not found" });
//     }

//     res.json({ message: "Address deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.deleteAddress = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `DELETE FROM addresses 
       WHERE id=$1 AND user_id=$2 
       RETURNING *`,
      [id, userId]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Address not found" });
    }

    // 🔴 If deleted address was default → assign another one
    if (result.rows[0].is_default) {
      await client.query(
        `UPDATE addresses
         SET is_default = true
         WHERE id = (
           SELECT id FROM addresses 
           WHERE user_id = $1 
           LIMIT 1
         )`,
        [userId]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Address deleted" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};