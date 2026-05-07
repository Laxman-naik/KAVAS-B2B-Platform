// const jwt = require("jsonwebtoken");
// const db = require("../config/db.js");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const vendorId = decoded.id || decoded.vendor_id;

//     if (!vendorId) {
//       return res.status(401).json({ message: "Invalid token payload" });
//     }

//     const result = await db.query(
//       `SELECT id FROM vendor_onboarding WHERE vendor.id = $1`,
//       [vendorId]
//     );

//     const onboarding = result.rows[0];

//     req.user = {
//       vendor_id: vendorId,
//       onboarding_id: onboarding ? onboarding.id : null,
//     };

//     next();
//   } catch (err) {
//     console.error("AUTH ERROR:", err);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
const { verifyAccessToken } = require("../utils/jwt.js");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH MIDDLEWARE - authHeader:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("AUTH MIDDLEWARE - No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("AUTH MIDDLEWARE - token extracted:", token ? "present" : "missing");

    const decoded = verifyAccessToken(token);
    console.log("AUTH MIDDLEWARE - decoded token:", decoded);

    req.user = {
      vendor_id: decoded.vendor_id,
      onboarding_id: decoded.onboarding_id || null,
    };

    console.log("AUTH MIDDLEWARE - req.user set:", req.user);
    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;