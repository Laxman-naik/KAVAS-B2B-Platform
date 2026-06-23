const express = require("express");
const router = express.Router();

const {
  getOrganizations,
  getVendorOrganizations,
} = require("../controllers/organizationController");

router.get("/", getOrganizations);
router.get("/vendors", getVendorOrganizations);

module.exports = router;