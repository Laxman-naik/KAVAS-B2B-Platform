const express = require("express");
const router = express.Router();

const {createProduct, getProducts, updateProduct, deleteProduct, getSingleProduct, } = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/all", getProducts);
router.get("/:id", getSingleProduct); 
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;