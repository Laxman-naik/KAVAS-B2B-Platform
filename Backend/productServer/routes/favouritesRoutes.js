const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { getFavourites, addToFavourites, removeFromFavourites, clearFavourites,} = require("../controllers/favouritesController");

router.get("/", verifyToken, getFavourites);
router.post("/add", verifyToken, addToFavourites);
router.delete("/remove/:productId", verifyToken, removeFromFavourites);
router.delete("/clear", verifyToken, clearFavourites);

module.exports = router;