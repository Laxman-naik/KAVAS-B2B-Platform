const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ✅ FIXED CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// 🔐 AUTH → 5001
// app.use('/api/auth', createProxyMiddleware({
//   target: 'http://localhost:5001',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api/auth': ''
//   }
// }));
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': ''
  },
  
  onProxyReq: (proxyReq, req) => {
    if (req.headers.cookie) {
      proxyReq.setHeader("cookie", req.headers.cookie);
    }
  },
  cookieDomainRewrite: "localhost"
}));

// 📦 PRODUCTS → 5002
app.use("/api/products", createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true,
  logLevel: "debug",
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  }
}));

// health check
app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

app.listen(5000, () => {
  console.log("API Gateway running on 5000");
});

app.use((req, res) => {
  console.log("Route not found:", req.method, req.url);
  res.status(404).send("Not Found");
});