const pool = require("../config/db");

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, slug, parent_id } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "name and slug are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO categories (name, slug, parent_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [name, slug, parent_id || null]
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("createCategory error:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM categories
      ORDER BY name ASC;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("getAllCategories error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get main categories
const getMainCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM categories
      WHERE parent_id IS NULL
      ORDER BY name ASC;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("getMainCategories error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get subcategories by parent id
const getSubcategoriesByParent = async (req, res) => {
  try {
    const { parentId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE parent_id = $1
      ORDER BY name ASC;
      `,
      [parentId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("getSubcategoriesByParent error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get category by id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE id = $1;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("getCategoryById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, parent_id } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "name and slug are required",
      });
    }

    if (parent_id && parent_id === id) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be its own parent",
      });
    }

    const existing = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const result = await pool.query(
      `
      UPDATE categories
      SET name = $1,
          slug = $2,
          parent_id = $3
      WHERE id = $4
      RETURNING *;
      `,
      [name, slug, parent_id || null, id]
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("updateCategory error:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1;
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("deleteCategory error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getMainCategories,
  getSubcategoriesByParent,
  getCategoryById,
  updateCategory,
  deleteCategory,
};