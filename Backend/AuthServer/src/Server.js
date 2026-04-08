// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const pool = require("./config/db");
// require("dotenv").config();

// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();

// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "https://kavasb2bwholesalehub.netlify.app"
//   ],
// }));

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));

// app.options(/.*/, cors());

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// app.get("/ping", (req, res) => {
//   res.json({ ok: true });
// });

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// pool.query("SELECT NOW()")
//   .then((res) => console.log("DB Connected:", res.rows))
//   .catch((err) => console.error("DB Error:", err));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log("Server running on", PORT);
// });

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
  "https://kavasb2bwholesalehub.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
  })
);

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

pool
  .query("SELECT NOW()")
  .then((res) => console.log("DB Connected:", res.rows))
  .catch((err) => console.error("DB Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});