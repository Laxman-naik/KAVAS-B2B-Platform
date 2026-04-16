const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);

router.get("/all", getProducts);
router.get("/:id", getSingleProduct); 
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get(
  "/category/:categorySlug/:subcategorySlug",
  productController.getProductsByCategoryAndSubcategory
);
router.get(
  "/category/:categorySlug",
  productController.getProductsByCategory
);

router.get("/:id", productController.getSingleProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;