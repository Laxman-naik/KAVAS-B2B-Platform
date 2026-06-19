const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const reviewController = require("../controllers/reviewController");

router.post("/",  upload.fields([{ name: "images", maxCount: 5 },{ name: "videos", maxCount: 2 },]), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/all", productController.getProducts);
router.get("/category/:categorySlug/:subcategorySlug",productController.getProductsByCategoryAndSubcategory);
router.get("/category/:categorySlug",productController.getProductsByCategory);
router.get("/flash-deals", productController.getFlashDeals);
router.get("/trending", productController.getTrendingProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/vendor/:organizationId/inventory",productController.getVendorInventory);
router.get("/vendor/:organizationId", productController.getVendorProducts);

router.put("/:id/flash-deal",authMiddleware,productController.addProductToFlashDeal);
router.patch("/:id/flash-deal",authMiddleware,productController.updateProductFlashDeal);

router.delete("/:id/flash-deal",authMiddleware,productController.removeProductFromFlashDeal);
router.get("/:productId/reviews", reviewController.getProductReviews);
router.post("/:productId/reviews", authMiddleware, reviewController.addProductReview);
router.get("/:id", productController.getSingleProduct);
// router.put("/:id", productController.updateProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);
module.exports = router;