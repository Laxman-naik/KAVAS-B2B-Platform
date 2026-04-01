const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // allow cookies
}));

// Health check
app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

// Auth Service (Buyer/Vendor)
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:5001', // auth service
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '' // remove /api/auth before forwarding
  },
  onProxyReq: (proxyReq, req) => {
    // forward cookies if any
    if (req.headers.cookie) {
      proxyReq.setHeader("cookie", req.headers.cookie);
    }
  },
  cookieDomainRewrite: "localhost",
  logLevel: "debug"
}));

// Admin Service
app.use('/api/admin', createProxyMiddleware({
  target: 'http://localhost:5001', // admin service port
  changeOrigin: true,
  pathRewrite: {
    '^/api/admin': '' // remove /api/admin before forwarding
  },
  onProxyReq: (proxyReq, req) => {
    if (req.headers.cookie) {
      proxyReq.setHeader("cookie", req.headers.cookie);
    }
  },
  cookieDomainRewrite: "localhost",
  logLevel: "debug"
}));

// Product Service
app.use("/api/products", createProxyMiddleware({
  target: "http://localhost:5002", // product service
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '' // forward paths like /api/products/* -> /* on product service
  },
  onProxyReq: (proxyReq, req) => {
    if (req.headers.cookie) {
      proxyReq.setHeader("cookie", req.headers.cookie);
    }
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  },
  logLevel: "debug"
}));

// 404 Catch-All
app.use((req, res) => {
  console.log("Route not found:", req.method, req.url);
  res.status(404).send("Not Found");
});

// Start Gateway
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on ${PORT}`);
});