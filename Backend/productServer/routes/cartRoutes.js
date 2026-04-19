const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/cart", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    "SELECT * FROM cart WHERE user_id=$1",
    [userId]
  );

  res.json(result.rows);
});
router.post("/", authMiddleware, addToCart);
router.delete("/clear", authMiddleware, clearCart);
router.put("/:itemId", authMiddleware, updateCartItem);
router.delete("/:itemId", authMiddleware, removeCartItem);

module.exports = router;