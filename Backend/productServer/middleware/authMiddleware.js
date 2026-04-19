// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     console.log("AUTH HEADER:", authHeader);

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token" });
//     }

//     const token = authHeader.split(" ")[1];

//     console.log("TOKEN RECEIVED:", token);

//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

//     console.log("DECODED:", decoded);

//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.log("AUTH ERROR FULL:", err);
//     return res.status(401).json({ message: err.message });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};