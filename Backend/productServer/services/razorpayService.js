const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createOrder = async (amount) => {
  return razorpay.orders.create({
    // amount: amount * 100,
    currency: "INR",
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