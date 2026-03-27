const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

pool.query("SELECT NOW()")
  .then(res => console.log("DB Connected:", res.rows))
  .catch(err => console.error("DB Error:", err));

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

app.get(
  "/api/user",
  authMiddleware,
  (req, res) => {
    res.json({ message: "User access", user: req.user });
  }
);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});