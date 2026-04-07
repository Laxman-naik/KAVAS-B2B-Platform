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

// // app.use(cors());
// app.use(cors({
//   origin: ["http://localhost:3000","https://kavasb2bwholesalehub.netlify.app",
//   ],
//   credentials: true
// }));
// app.use(express.json());

// app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// pool.query("SELECT NOW()")
//   .then(res => console.log("DB Connected:", res.rows))
//   .catch(err => console.error("DB Error:", err));

// app.get(
//   "/api/admin",
//   authMiddleware,
//   roleMiddleware("admin"),
//   (req, res) => {
//     res.json({ message: "Admin access granted" });
//   }
// );

// app.get(
//   "/api/vendor",
//   authMiddleware,
//   roleMiddleware("vendor", "admin"),
//   (req, res) => {
//     res.json({ message: "Vendor access granted" });
//   }
// );

// app.get(
//   "/api/user",
//   authMiddleware,
//   (req, res) => {
//     res.json({ message: "User access", user: req.user });
//   }
// );

// app.get("/", (req, res) => {
//   res.send("Server running");
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on ${process.env.PORT}`);
// });

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

/* =========================
   CORS (MUST BE FIRST)
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "https://kavasb2bwholesalehub.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* 🔥 IMPORTANT: preflight handler */
// app.options("*", cors());
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   CORE MIDDLEWARE
========================= */
app.use(express.json());
app.use(cookieParser());

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

/* =========================
   DB CHECK
========================= */
pool.query("SELECT NOW()")
  .then((res) => console.log("DB Connected:", res.rows))
  .catch((err) => console.error("DB Error:", err));

/* =========================
   TEST ROUTES
========================= */
app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

app.get(
  "/api/vendor",
  authMiddleware,
  roleMiddleware("vendor", "admin"),
  (req, res) => {
    res.json({ message: "Vendor access granted" });
  }
);

app.get("/api/user", authMiddleware, (req, res) => {
  res.json({ message: "User access", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

/* =========================
   START SERVER
========================= */
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});