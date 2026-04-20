// const express = require("express");
// const router = express.Router();

// const productController = require("../controllers/productController");

// router.post("/", productController.createProduct);
// router.get("/", productController.getProducts);

// router.get("/all", getProducts);
// router.get("/:id", getSingleProduct); 
// router.post("/", authMiddleware, createProduct);
// router.put("/:id", authMiddleware, updateProduct);
// router.delete("/:id", authMiddleware, deleteProduct);
// router.get( "/category/:categorySlug/:subcategorySlug", productController.getProductsByCategoryAndSubcategory);
// router.get( "/category/:categorySlug", productController.getProductsByCategory );

// router.get("/:id", productController.getSingleProduct);
// router.put("/:id", productController.updateProduct);
// router.delete("/:id", productController.deleteProduct);

// module.exports = router;

const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, productController.createProduct);
router.get("/", productController.getProducts);
<<<<<<< HEAD

router.get(
  "/category/:categorySlug/:subcategorySlug",
  productController.getProductsByCategoryAndSubcategory
);
router.get(
  "/category/:categorySlug",
  productController.getProductsByCategory
);

router.get("/all", productController.getProducts);
=======
router.get("/all", productController.getProducts);
router.get("/category/:categorySlug/:subcategorySlug", productController.getProductsByCategoryAndSubcategory);
router.get("/category/:categorySlug", productController.getProductsByCategory);
>>>>>>> 5ff02b31b03c74e2adc4e331a635a51be58981b3
router.get("/:id", productController.getSingleProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;