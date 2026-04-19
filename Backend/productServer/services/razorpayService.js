const createRazorpayOrder = async (req, res) => {
  const { amount, order_id } = req.body;

  const razorpayOrder = await razorpay.orders.create({
    amount: amount,
    currency: "INR",
    receipt: order_id,
  });

  res.json({
    razorpayOrder,
    key: process.env.RZP_KEY,
  });
};
exports.verifyPayment = ({ order_id, payment_id, signature }) => {
  const crypto = require("crypto");

  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");

  return generated === signature;
};