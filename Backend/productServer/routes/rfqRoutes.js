const express = require("express");
const router = express.Router();

const {
  createRFQ,
  getRFQs,
  getSingleRFQ,
  getBuyerRFQs,
  updateRFQStatus,
  deleteRFQ,
  assignVendorsToRFQ,
  getRFQQuotes,
  acceptQuote,
} = require("../controllers/rfqController");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "RFQ route working",
  });
});

router.post("/", createRFQ);
router.get("/", getRFQs);
router.get("/buyer/:buyerOrgId", getBuyerRFQs);
router.post("/:rfqId/vendors", assignVendorsToRFQ);
router.get("/:rfqId/quotes", getRFQQuotes);
router.get("/:id", getSingleRFQ);
router.put("/quotes/:quoteId/accept", acceptQuote);
router.put("/:id/status", updateRFQStatus);
router.delete("/:id", deleteRFQ);

module.exports = router;