const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartCount,
  getCartSummary,
  mergeCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getCart);
router.get("/count", authMiddleware, getCartCount);
router.get("/summary", authMiddleware, getCartSummary);

router.post("/", authMiddleware, addToCart);
router.post("/merge", authMiddleware, mergeCart);

router.delete("/clear", authMiddleware, clearCart);
router.put("/:itemId", authMiddleware, updateCartItem);
router.delete("/:itemId", authMiddleware, removeCartItem);

module.exports = router;
