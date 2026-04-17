const express = require("express");
const router = express.Router();

const { createCategory, getAllCategories, getMainCategories, getSubcategoriesByParent, getCategoryById, updateCategory, deleteCategory, } = require("../controllers/categoryController");

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/main", getMainCategories);
router.get("/subcategories/:parentId", getSubcategoriesByParent);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;