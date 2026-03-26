const express = require("express");
const router = express.Router();

const { createProduct, getProducts } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createProduct);
router.get("/", authMiddleware, getProducts);

module.exports = router;