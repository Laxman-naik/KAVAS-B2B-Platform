const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("PRODUCT AUTH - authHeader:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    console.log("PRODUCT AUTH - decoded:", decoded);

    req.user = {
      ...decoded,
      id: decoded.id || decoded.vendor_profile_id || decoded.vendor_id,
      vendor_profile_id: decoded.vendor_profile_id,
      vendor_id: decoded.vendor_id,
      onboarding_id: decoded.onboarding_id,
      organization_id: decoded.organization_id,
      role: decoded.role,
    };

    console.log("PRODUCT AUTH - final req.user:", req.user);

    next();
  } catch (err) {
    console.error("PRODUCT AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
};