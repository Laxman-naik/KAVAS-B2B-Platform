const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("API Server Running");
});

app.listen(process.env.PORT, () => {
  console.log(`product Server running on ${process.env.PORT}`);
});