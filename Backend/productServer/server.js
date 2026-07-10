require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const cookieParser = require("cookie-parser");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const searchRoutes = require("./routes/searchRoutes");
const favouritesRoutes = require("./routes/favouritesRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const vendorRFQRoutes = require("./routes/vendorRFQRoutes");

const vendorPayoutRoutes = require("./routes/vendorPayoutRoutes");
const adminPayoutRoutes = require("./routes/adminPayoutRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const vendorDashboardRoutes = require("./routes/vendorDashboardRoutes");
const vendorPaymentHistoryRoutes = require("./routes/vendorPaymentHistoryRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Product Server Running");
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/favourites", favouritesRoutes);

app.use("/api/rfqs", rfqRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/vendor", vendorRFQRoutes);

app.use("/api/vendor-payouts", vendorPayoutRoutes);
app.use("/api/admin/payouts", adminPayoutRoutes);
app.use("/api/vendor", vendorDashboardRoutes);
app.use("/api/vendor/payments", vendorPaymentHistoryRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);


pool
  .query("SELECT NOW()")
  .then((res) => console.log("DB Connected:", res.rows))
  .catch((err) => console.error("DB Error:", err));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Product Server running on ${PORT}`);
});