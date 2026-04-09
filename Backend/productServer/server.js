// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const productRoutes = require("./routes/productRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/products", productRoutes);

// app.get("/", (req, res) => {
//   res.send("API product Server Running");
// });

// app.listen(process.env.PORT, () => {
//   console.log(`product Server running on ${process.env.PORT}`);
// });

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

// ✅ ONLY allow Gateway + Localhost
const allowedOrigins = [
  "http://localhost:3000",
  process.env.GATEWAY_URL,
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

// HEALTH
app.get("/", (req, res) => {
  res.send("Product Server Running 🚀");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Product Server running on ${PORT}`);
});