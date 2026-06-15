const pool = require("../config/db");

const searchMarketplace = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const limit = Number(req.query.limit) || 20;

    if (!q) {
      return res.json({
        products: [],
        suppliers: [],
        categories: [],
      });
    }

    const likeQuery = `%${q}%`;

    const productsResult = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.moq,
        p.stock,
        p.slug,
        p.is_featured,
        p.created_at,
        o.name AS organization_name
      FROM products p
      LEFT JOIN organizations o
        ON p.organization_id = o.id
      LEFT JOIN product_categories pc
        ON pc.product_id = p.id
      LEFT JOIN categories c
        ON c.id = pc.category_id
      WHERE p.is_active = TRUE
      AND (
        p.name ILIKE $1
        OR COALESCE(p.description, '') ILIKE $1
        OR c.name ILIKE $1
      )
      ORDER BY
        p.is_featured DESC,
        p.created_at DESC
      LIMIT $2
      `,
      [likeQuery, limit]
    );

    const categoriesResult = await pool.query(
      `
      SELECT
        id,
        name,
        slug
      FROM categories
      WHERE is_active = TRUE
      AND name ILIKE $1
      ORDER BY name ASC
      LIMIT $2
      `,
      [likeQuery, limit]
    );

    return res.status(200).json({
      products: productsResult.rows,
      suppliers: [],
      categories: categoriesResult.rows,
    });
  } catch (error) {
    console.error("searchMarketplace error:", error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

module.exports = {
  searchMarketplace,
};