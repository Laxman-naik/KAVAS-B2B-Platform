// // const express = require("express");
// // const cors = require("cors");
// // const pool = require("./config/db");
// // require("dotenv").config();

// // const cookieParser = require("cookie-parser");
// // const authRoutes = require("./routes/authRoutes");
// // const adminRoutes = require("./routes/adminRoutes");
// // const authMiddleware = require("./middleware/authMiddleware");
// // const roleMiddleware = require("./middleware/roleMiddleware");

// // const app = express();

// // // app.use(cors());
// // app.use(cors({
// //   origin: ["http://localhost:3000","https://kavasb2bwholesalehub.netlify.app",
// //   ],
// //   credentials: true
// // }));
// // app.use(express.json());

// // app.use(cookieParser());

// // app.use("/api/auth", authRoutes);
// // app.use("/api/admin", adminRoutes);

// // pool.query("SELECT NOW()")
// //   .then(res => console.log("DB Connected:", res.rows))
// //   .catch(err => console.error("DB Error:", err));

// // app.get(
// //   "/api/admin",
// //   authMiddleware,
// //   roleMiddleware("admin"),
// //   (req, res) => {
// //     res.json({ message: "Admin access granted" });
// //   }
// // );

// // app.get(
// //   "/api/vendor",
// //   authMiddleware,
// //   roleMiddleware("vendor", "admin"),
// //   (req, res) => {
// //     res.json({ message: "Vendor access granted" });
// //   }
// // );

// // app.get(
// //   "/api/user",
// //   authMiddleware,
// //   (req, res) => {
// //     res.json({ message: "User access", user: req.user });
// //   }
// // );

// // app.get("/", (req, res) => {
// //   res.send("Server running");
// // });

// // app.listen(process.env.PORT, () => {
// //   console.log(`Server running on ${process.env.PORT}`);
// // });

// const express = require("express");
// const cors = require("cors");
// const pool = require("./config/db");
// require("dotenv").config();

// const cookieParser = require("cookie-parser");

// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// const authMiddleware = require("./middleware/authMiddleware");
// const roleMiddleware = require("./middleware/roleMiddleware");

// const app = express();

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://kavasb2bwholesalehub.netlify.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(null, false);
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.options(/.*/, cors());

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// app.get(
//   "/api/admin",
//   authMiddleware,
//   roleMiddleware("admin"),
//   (req, res) => {
//     res.json({ message: "Admin access granted" });
//   }
// );

// app.get("/api/vendor", authMiddleware, roleMiddleware("vendor", "admin"), (req, res) => {
//   res.json({ message: "Vendor access granted" });
// });

// app.get("/api/user", authMiddleware, (req, res) => {
//   res.json({ message: "User access", user: req.user });
// });

// app.get("/", (req, res) => {
//   res.send("Server running");
// });

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// pool.query("SELECT NOW()")
//   .then((res) => console.log("DB Connected:", res.rows))
//   .catch((err) => console.error("DB Error:", err));

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on ${process.env.PORT}`);
// });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pool = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://kavasb2bwholesalehub.netlify.app"
  ],
  credentials: true
}));

app.options(/.*/, cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

pool.query("SELECT NOW()")
  .then((res) => console.log("DB Connected:", res.rows))
  .catch((err) => console.error("DB Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});