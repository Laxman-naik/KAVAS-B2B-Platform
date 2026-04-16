const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ONLY allow Gateway + Localhost
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

// ROUTES
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

// HEALTH
app.get("/", (req, res) => {
  res.send("Product Server Running ");
});

pool
  .query("SELECT NOW()")
  .then((res) => console.log("DB Connected:", res.rows))
  .catch((err) => console.error("DB Error:", err));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Product Server running on ${PORT}`);
});