const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    // 1. From header
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. From cookie (fallback)
    // if (!token && req.cookies?.accessToken) {
    //   token = req.cookies.accessToken;
    // }

    // No token anywhere
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;