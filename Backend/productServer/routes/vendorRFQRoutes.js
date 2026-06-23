const express = require("express");
const router = express.Router();

const {
  getVendorRFQs,
  updateVendorRFQStatus,
  submitQuote,
  getVendorQuotes,
  updateQuoteStatus,
} = require("../controllers/vendorRFQController");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Vendor route working",
  });
});

router.get("/rfqs", getVendorRFQs);
router.patch("/rfqs/:id", updateVendorRFQStatus);

router.get("/quotes", getVendorQuotes);
router.post("/quotes", submitQuote);
router.patch("/quotes/:id", updateQuoteStatus);

module.exports = router;