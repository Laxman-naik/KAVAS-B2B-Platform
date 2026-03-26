const pool = require("../config/db");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, price]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};