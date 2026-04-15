const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pool = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://kavsawholesalehub.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("Server is running 🚀");
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

pool
  .query("SELECT NOW()")
  .then((res) => console.log("DB Connected:", res.rows))
  .catch((err) => console.error("DB Error:", err));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const pool = require("./config/db");
// require("dotenv").config();

// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();

// // ✅ ONLY allow Gateway + Localhost
// const allowedOrigins = [
//   "http://localhost:3000",
//   process.env.GATEWAY_URL,
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // HEALTH
// app.get("/", (req, res) => {
//   res.status(200).send("Auth Server Running 🚀");
// });

// app.get("/ping", (req, res) => {
//   res.json({ ok: true });
// });

// // ROUTES
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// // 404
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // DB CHECK
// pool
//   .query("SELECT NOW()")
//   .then((res) => console.log("DB Connected:", res.rows))
//   .catch((err) => console.error("DB Error:", err));

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log("Auth Server running on", PORT);
// });