const pool = require("../db");

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    const result = await pool.query(
      `INSERT INTO products
      (name, sku, category_id, vendor_id, unit_price, moq, unit, lead_time, description, tags, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        data.name,
        data.sku,
        data.category_id,
        data.vendor_id,
        data.unit_price,
        data.moq,
        data.unit,
        data.lead_time,
        data.description,
        data.tags,
        data.status || "listed",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "SKU already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products SET
        name=$1,
        sku=$2,
        category_id=$3,
        vendor_id=$4,
        unit_price=$5,
        moq=$6,
        unit=$7,
        lead_time=$8,
        description=$9,
        tags=$10,
        status=$11,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$12
      RETURNING *`,
      [
        req.body.name,
        req.body.sku,
        req.body.category_id,
        req.body.vendor_id,
        req.body.unit_price,
        req.body.moq,
        req.body.unit,
        req.body.lead_time,
        req.body.description,
        req.body.tags,
        req.body.status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products SET status='archived' WHERE id=$1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product archived" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM products
       WHERE status != 'archived'
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};