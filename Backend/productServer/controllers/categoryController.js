// controllers/categoryController.js

const pool = require("../db");

exports.getCategoriesWithSub = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        s.id AS sub_id,
        s.name AS sub_name
      FROM categories c
      LEFT JOIN subcategories s ON s.category_id = c.id
      ORDER BY c.name, s.name;
    `;

    const result = await pool.query(query);

    const data = {};

    result.rows.forEach(row => {
      if (!data[row.category_id]) {
        data[row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          subcategories: []
        };
      }

      if (row.sub_id) {
        data[row.category_id].subcategories.push({
          id: row.sub_id,
          name: row.sub_name
        });
      }
    });

    res.json(Object.values(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};