// module.exports = (...allowedRoles) => {
//   return (req, res, next) => {
//     try {
//       const user = req.user;

//       if (!user || !allowedRoles.includes(user.role)) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       next();

//     } catch (err) {
//       res.status(500).json({ message: "Role check failed" });
//     }
//   };
// };

// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };

// module.exports = authorizeRoles;

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      //  No user (authMiddleware missing)
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Role not allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();

    } catch (err) {
      return res.status(500).json({ message: "Role check failed" });
    }
  };
};

module.exports = authorizeRoles;