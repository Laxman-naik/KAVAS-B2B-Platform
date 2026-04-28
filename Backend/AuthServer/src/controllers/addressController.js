const pool = require("../config/db");

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
      is_default = false,
      active = true,
    } = req.body;

    await client.query("BEGIN");

    // reset previous default if needed
    if (is_default) {
      await client.query(
        `UPDATE addresses SET is_default = false WHERE user_id = $1`,
        [userId]
      );
    }

    const result = await client.query(
      `INSERT INTO addresses (
        user_id,
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
        active
      )
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
        phone,
        label,
        type,
        is_default,
        active,
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

    if (is_default === true) {
      await client.query(
        `UPDATE addresses SET is_default = false WHERE user_id = $1`,
        [userId]
      );
    }

    const result = await client.query(
      `UPDATE addresses SET
        address_line1 = COALESCE($1, address_line1),
        address_line2 = COALESCE($2, address_line2),
        city = COALESCE($3, city),
        state = COALESCE($4, state),
        country = COALESCE($5, country),
        postal_code = COALESCE($6, postal_code),
        phone = COALESCE($7, phone),
        label = COALESCE($8, label),
        type = COALESCE($9, type),
        is_default = COALESCE($10, is_default),
        active = COALESCE($11, active)
       WHERE id = $12 AND user_id = $13
       RETURNING *`,
      [
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

exports.deleteAddress = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `DELETE FROM addresses
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Address not found" });
    }

    const deleted = result.rows[0];

    // safer fallback: only set default if none exists
    if (deleted.is_default) {
      const remaining = await client.query(
        `SELECT id FROM addresses WHERE user_id = $1 LIMIT 1`,
        [userId]
      );

      if (remaining.rows.length > 0) {
        await client.query(
          `UPDATE addresses SET is_default = true WHERE id = $1`,
          [remaining.rows[0].id]
        );
      }
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

exports.setDefaultAddress = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const result = await client.query(
      `UPDATE addresses
       SET is_default = CASE WHEN id = $1 THEN true ELSE false END
       WHERE user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(result.rows.find(a => a.id === id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};