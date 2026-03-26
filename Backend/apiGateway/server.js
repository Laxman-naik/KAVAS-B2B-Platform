const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

// 🔐 AUTH → 5001
app.use("/api/auth", createProxyMiddleware({ target: "http://localhost:5001", changeOrigin: true, logLevel: "debug" }));

// 📦 PRODUCTS → 5002
app.use("/api/products", createProxyMiddleware({target: "http://localhost:5002", changeOrigin: true, logLevel: "debug" }));

// health check
app.get("/", (req, res) => { res.send("API Gateway Running");});

app.listen(5000, () => { console.log("API Gateway running on 5000");});