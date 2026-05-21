const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    let reply = "Sorry, I did not understand.";

    if (message.toLowerCase().includes("product")) {
      reply = "You can search products from All Products page.";
    } else if (message.toLowerCase().includes("order")) {
      reply = "You can track your order from My Orders section.";
    } else if (message.toLowerCase().includes("rfq")) {
      reply = "You can create RFQ from the RFQ page.";
    } else if (message.toLowerCase().includes("hello")) {
      reply = "Hello! How can I help you today?";
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Server error" });
  }
});

module.exports = router;