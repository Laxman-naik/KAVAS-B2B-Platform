const jwt = require("jsonwebtoken");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        return res.status(401).json({ message: "No token" });
      }

      // 🔥 Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 Attach user
      req.user = decoded; // { id, role }

      // 🔥 Role check
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = authorizeRoles;