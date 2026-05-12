// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     console.log("authHeader:", authHeader);

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token" });
//     }

//     const token = authHeader.split(" ")[1];
  
//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

//     req.user = decoded;

//     next();
//   } catch (err) {
//     console.error("JWT verify error:", err.message);
//     return res.status(401).json({ message: "Invalid token", error: err.message });
//   }
// };

const jwt = require("jsonwebtoken");

module.exports = (
  req,
  res,
  next
) => {
  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.ACCESS_SECRET
      );

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};