import pool from "../config/db.js"; // change this path if your db file is elsewhere

export const searchMarketplace = async (req, res) => {
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

    const [productsResult, suppliersResult, categoriesResult] = await Promise.all([
      pool.query(
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
        WHERE
          p.is_active = TRUE
          AND (
            p.name ILIKE $1
            OR p.description ILIKE $1
          )
        ORDER BY p.is_featured DESC, p.created_at DESC
        LIMIT $2
        `,
        [likeQuery, limit]
      ),

      pool.query(
        `
        SELECT
          id,
          name,
          description,
          industry,
          logo_url,
          type
        FROM organizations
        WHERE
          type IN ('supplier', 'both')
          AND (
            name ILIKE $1
            OR description ILIKE $1
            OR industry ILIKE $1
          )
        ORDER BY verified DESC, created_at DESC
        LIMIT $2
        `,
        [likeQuery, limit]
      ),

      pool.query(
        `
        SELECT
          id,
          name,
          parent_id
        FROM categories
        WHERE name ILIKE $1
        LIMIT $2
        `,
        [likeQuery, limit]
      ),
    ]);

    return res.json({
      products: productsResult.rows,
      suppliers: suppliersResult.rows,
      categories: categoriesResult.rows,
    });
  } catch (error) {
    console.error("searchMarketplace error:", error);
    return res.status(500).json({ message: "Search failed" });
  }
};