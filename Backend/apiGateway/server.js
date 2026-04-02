// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const { createProxyMiddleware } = require("http-proxy-middleware");

// const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;
// const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL;


// const app = express();

// // ✅ CORS setup
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
// }));

// app.use((req, res, next) => {
//   console.log("REQ PATH:", req.method, req.url);
//   next();
// });

// // Health check
// app.get("/", (req, res) => {
//   res.send("API Gateway Running");
// });

// // Auth Service (Buyer/Vendor)
// app.use('/api/auth', createProxyMiddleware({
//   target: AUTH_SERVICE, // auth service
//   changeOrigin: true,
//   onProxyReq: (proxyReq, req) => {
//     // forward cookies if any
//     if (req.headers.cookie) {
//       proxyReq.setHeader("cookie", req.headers.cookie);
//     }
//   },
//   cookieDomainRewrite: "",
//   logLevel: "debug"
// }));

// // Admin Service
// app.use('/api/admin', createProxyMiddleware({
//   target: AUTH_SERVICE, // admin service port
//   changeOrigin: true,
//   onProxyReq: (proxyReq, req) => {
//     if (req.headers.cookie) {
//       proxyReq.setHeader("cookie", req.headers.cookie);
//     }
//   },
//   cookieDomainRewrite: "localhost",
//   logLevel: "debug"
// }));

// // Product Service
// app.use("/api/products", createProxyMiddleware({
//   target: PRODUCT_SERVICE, // product service
//   changeOrigin: true,
//   onProxyReq: (proxyReq, req) => {
//     if (req.headers.cookie) {
//       proxyReq.setHeader("cookie", req.headers.cookie);
//     }
//   },
//   onProxyRes: (proxyRes) => {
//     proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
//     proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
//   },
//   logLevel: "debug"
// }));

// // Start Gateway
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`API Gateway running on ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// 🔥 DEBUG FIRST
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// ✅ CORS
app.use(cors({
  origin: ["http://localhost:3000","https://kavaswholesalehub.netlify.app"],
  credentials: true,
}));

// ✅ Health
app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

// ✅ AUTH
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': ''   // 🔥 THIS FIXES EVERYTHING
  },

  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = 'https://kavaswholesalehub.netlify.app';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  }
}));

// ✅ ADMIN
app.use('/api/admin', createProxyMiddleware({
  target: process.env.AUTH_URL,
  changeOrigin: true,

  onProxyRes: (proxyRes) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = 'https://kavaswholesalehub.netlify.app';
  proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
}
}));

// ✅ PRODUCT
app.use('/api/products', createProxyMiddleware({
  target: process.env.PRODUCT_URL,
  changeOrigin: true,
}));

// ✅ START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on ${PORT}`);
});