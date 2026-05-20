const Razorpay = require("razorpay");

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  throw new Error("Razorpay keys are missing in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (amount) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid Razorpay amount");
  }
  try {
    return await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
  } catch (err) {
    console.error("RAZORPAY CREATE ORDER ERROR:", err);

    throw err;
  }
};

module.exports = {createOrder,};