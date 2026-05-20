// const Razorpay = require("razorpay");

// if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
//   throw new Error("Razorpay keys are missing in environment variables");
// }

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// const createOrder = async (amount) => {
//   return await razorpay.orders.create({
//     amount,
//     currency: "INR",
//     receipt: `rcpt_${Date.now()}`,
//   });
// };

// module.exports = {
//   createOrder,
// };

const Razorpay = require("razorpay");

/* ======================================================
   Razorpay Service
   Safe initialization for development + production
====================================================== */

let razorpay = null;

/* Check Environment Variables */

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

/* Initialize Razorpay Only If Keys Exist */

if (RAZORPAY_KEY_ID && RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
  });

  console.log("✅ Razorpay Initialized Successfully");
} else {
  console.warn(
    "⚠️ Razorpay keys missing. Payment module disabled."
  );
}

/* ======================================================
   Create Razorpay Order
====================================================== */

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
