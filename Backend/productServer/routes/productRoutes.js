const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, productController.createProduct);
router.get("/", productController.getProducts);
router.get("/all", productController.getProducts);
router.get("/category/:categorySlug/:subcategorySlug", productController.getProductsByCategoryAndSubcategory);
router.get("/category/:categorySlug", productController.getProductsByCategory);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/:id", productController.getSingleProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);


module.exports = router;