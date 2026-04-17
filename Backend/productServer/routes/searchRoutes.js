const express = require("express");
const { searchMarketplace } = require("../controllers/searchController");

const router = express.Router();

router.get("/", searchMarketplace);


module.exports = router;