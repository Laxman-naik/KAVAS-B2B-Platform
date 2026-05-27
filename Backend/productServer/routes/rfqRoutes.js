const express = require("express");
const router = express.Router();

const {
  createRFQ,
  getRFQs,
  getSingleRFQ,
  getBuyerRFQs,
  updateRFQStatus,
  deleteRFQ,
} = require("../controllers/rfqController");

router.post("/", createRFQ);
router.get("/", getRFQs);
router.get("/buyer/:buyerOrgId", getBuyerRFQs);
router.get("/:id", getSingleRFQ);
router.put("/:id/status", updateRFQStatus);
router.delete("/:id", deleteRFQ);

module.exports = router;