const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const pool = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const addressRoutes = require("./routes/addressRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = new Set([
  "http://localhost:3000",
  "https://kavsawholesalehub.netlify.app",
  "https://kavas.netlify.app",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Server is running 🚀");
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/vendor", vendorRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

pool.connect()
  .then(client => {
    console.log("DB Connected");
    client.release();
  })
  .catch(err => console.error("DB Error:", err));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const helmet = require("helmet");
// const passport = require("passport");

// require("dotenv").config();
// <<<<<<< HEAD
// const pool = require("./config/db");
// require("./config/passport");

// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const addressRoutes = require("./routes/addressRoutes");
// const vendorRoutes = require("./routes/vendorRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// =======

// <<<<<<< HEAD
// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const addressRoutes = require("./routes/addressRoutes");
// const vendorRoutes = require("./routes/vendorRoutes");
// const orderRoutes = require("./routes/orderRoutes")
// const profileRoutes = require("./routes/profileRoutes")
// =======
// const pool =
//   require("./config/db");

// require("./config/passport");

// const authRoutes =
//   require("./routes/authRoutes");
// >>>>>>> 141a9f0c4a0e0b84487e06cb2bc2f5266fb4315d
// >>>>>>> ed3d426d631124719c0912378469a63881d3145a

// const app = express();
// app.set("trust proxy", 1);

// app.use(helmet());
// app.use(express.json());
// app.use(cookieParser());
// app.use(passport.initialize());

// const allowedOrigins = new Set([
//   "http://localhost:3000",
//   "https://kavsawholesalehub.netlify.app",
//   "https://kavas.netlify.app",
// ]);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.has(origin)) {
//         return callback(null, true);
//       }

//       return callback(
//         new Error("Not allowed by CORS")
//       );
//     },

//     credentials: true,
//   })
// );

// app.get("/", (req, res) => {
//   res.status(200).send("Server running 🚀");
// });

// <<<<<<< HEAD
// =======
// <<<<<<< HEAD
// >>>>>>> ed3d426d631124719c0912378469a63881d3145a
// app.get("/ping", (req, res) => {
//   res.json({
//     ok: true,
//   });
// });


// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/address", addressRoutes);
// app.use("/api/vendor", vendorRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/orders", orderRoutes);
// <<<<<<< HEAD
// =======
// =======
// app.use(
//   "/api/auth",
//   authRoutes
// );
// >>>>>>> 141a9f0c4a0e0b84487e06cb2bc2f5266fb4315d
// >>>>>>> ed3d426d631124719c0912378469a63881d3145a

// app.use((req, res) => {
//   res.status(404).json({
//     message: "Route not found",
//   });
// });

// pool
//   .connect()
//   .then((client) => {
//     console.log("DB Connected");
//     client.release();
//   })
//   .catch((err) => {
//     console.error("DB Error:", err);
//   });

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });