const pool = require("../config/db");

const searchMarketplace = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const limit = Number(req.query.limit) || 5;

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
        o.name AS organization_name
      FROM products p
      LEFT JOIN organizations o ON p.organization_id = o.id
      WHERE p.is_active = TRUE
      AND (
        p.name ILIKE $1
        OR p.description ILIKE $1
      )
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT $2
      `,
      [likeQuery, limit]
    );

    return res.json({
      products: productsResult.rows,
      suppliers: [],
      categories: [],
    });
  } catch (error) {
    console.error("searchMarketplace error:", error);
    return res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};

module.exports = {
  searchMarketplace,
};