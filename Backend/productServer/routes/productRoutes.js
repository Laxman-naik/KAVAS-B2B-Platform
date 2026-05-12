const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

<<<<<<< HEAD
router.post("/", authMiddleware, upload.array("images", 10), productController.createProduct);
=======
router.post("/", authMiddleware, productController.createProduct);
>>>>>>> dacb9434a2740621473dc5129e65304e26b294b7
router.get("/", productController.getProducts);
router.get("/all", productController.getProducts);
router.get("/category/:categorySlug/:subcategorySlug", productController.getProductsByCategoryAndSubcategory);
router.get("/category/:categorySlug", productController.getProductsByCategory);
router.get("/trending", productController.getTrendingProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/:vendorId", productController.getVendorProducts);
router.get("/:id", productController.getSingleProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);



module.exports = router;