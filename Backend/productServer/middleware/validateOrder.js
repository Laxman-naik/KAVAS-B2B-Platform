const validateCreateOrder = (req, res, next) => {
  const { idempotency_key } = req.body;

  if (!idempotency_key || typeof idempotency_key !== "string") {
    return res.status(400).json({ message: "Invalid idempotency key" });
  }

  next();
};

module.exports = { validateCreateOrder, };