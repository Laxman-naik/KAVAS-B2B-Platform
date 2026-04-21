const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  getFavourites,
  addToFavourites,
  removeFromFavourites,
  clearFavourites,
} = require("../controllers/favouritesController");

router.get("/", verifyToken, getFavourites);
router.post("/", verifyToken, addToFavourites);
router.delete("/:productId", verifyToken, removeFromFavourites);
router.delete("/", verifyToken, clearFavourites);

module.exports = router;