const pool = require("../config/db");

/* CREATE PRODUCT */
exports.createProduct = async (req, res) => {
  try {
    const { name, slug, categoryId, subcategoryId, organizationId, isTopProduct, parentProductId, price, mrp,
      minOrderQty, stock, unit, weight, dispatchTimeDays, description, imageUrl, isActive, isFeatured, } = req.body;

    const result = await pool.query(
      `INSERT INTO products (
        name, slug, category_id, subcategory_id, organization_id, is_top_product, parent_product_id, price, mrp, min_order_qty, stock,
        unit, weight, dispatch_time_days, description, image_url, is_active, is_featured
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      RETURNING *`,
      [name, slug, categoryId, subcategoryId, organizationId, isTopProduct || false,
        parentProductId || null, price, mrp, minOrderQty, stock, unit, weight, dispatchTimeDays, description, imageUrl, isActive ?? true, isFeatured || false,]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, slug, categoryId, subcategoryId, organizationId, isTopProduct, parentProductId, price,  mrp,
      minOrderQty, stock, unit, weight, dispatchTimeDays, description, imageUrl, isActive, isFeatured, } = req.body;

    const result = await pool.query(
      `UPDATE products SET  name=$1, slug=$2, category_id=$3, subcategory_id=$4, organization_id=$5, is_top_product=$6, parent_product_id=$7, price=$8,  mrp=$9,
        min_order_qty=$10, stock=$11, unit=$12, weight=$13, dispatch_time_days=$14, description=$15, image_url=$16, is_active=$17, is_featured=$18, updated_at=CURRENT_TIMESTAMP
      WHERE id=$19
      RETURNING *`,
      [name, slug, categoryId, subcategoryId, organizationId, isTopProduct, parentProductId, price,
         mrp, minOrderQty, stock, unit, weight, dispatchTimeDays, description, imageUrl, isActive, isFeatured, id,]
    );

    if (!result.rows.length) {
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
      `UPDATE products SET is_active=false WHERE id=$1 RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deactivated" });
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
       WHERE is_active = true
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // basic validation (don’t skip this)
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const result = await pool.query(
      `SELECT * FROM products 
       WHERE id = $1 AND is_active = true`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};