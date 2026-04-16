const express = require("express");
const router = express.Router();

const {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createAddress);
router.get("/", authMiddleware, getUserAddresses);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

module.exports = router;