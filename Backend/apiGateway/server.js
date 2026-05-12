const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// AUTH
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: "",

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },

    onProxyRes: (proxyRes) => {
      const cookies = proxyRes.headers["set-cookie"];
      if (cookies) {
        proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
          cookie.replace(/Domain=[^;]+/i, "Domain=")
        );
      }
    },
  })
);

// PROFILE
app.use(
  "/api/profile",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: "",

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }

      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

// ORDERS
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: "",

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }

      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

// ADMIN
app.use(
  "/api/admin",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: "",

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

// PRODUCTS
app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    secure: false,

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

// FAVOURITES
app.use(
  "/api/favourites",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    secure: false,

    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
    },
  })
);

app.get("/", (req, res) => {
  res.send("API Gateway Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on ${PORT}`);
});

console.log("AUTH:", process.env.AUTH_SERVICE_URL);
console.log("PRODUCT:", process.env.PRODUCT_SERVICE_URL);

// const express = require("express");
// const cors = require("cors");
// const { createProxyMiddleware } = require("http-proxy-middleware");
// require("dotenv").config();

// const app = express();

// // CORS (ONLY FRONTEND ALLOWED)
// const allowedOrigins = [
//   "http://localhost:3000",
//   process.env.FRONTEND_URL,
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );

// // AUTH SERVICE PROXY
// app.use(
//   "/api/auth",
//   createProxyMiddleware({
//     target: process.env.AUTH_SERVICE_URL,
//     changeOrigin: true,
//     secure: true,
//     cookieDomainRewrite: "",

//     onProxyReq: (proxyReq, req) => {
//       if (req.headers.cookie) {
//         proxyReq.setHeader("cookie", req.headers.cookie);
//       }
//     },

//     onProxyRes: (proxyRes) => {
//       const cookies = proxyRes.headers["set-cookie"];
//       if (cookies) {
//         proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
//           cookie.replace(/Domain=[^;]+/i, "Domain=")
//         );
//       }
//     },
//   })
// );

// // ADMIN SERVICE (same auth server)
// app.use(
//   "/api/admin",
//   createProxyMiddleware({
//     target: process.env.AUTH_SERVICE_URL,
//     changeOrigin: true,
//     secure: true,
//     cookieDomainRewrite: "",
//   })
// );

// // PRODUCT SERVICE PROXY
// app.use(
//   "/api/products",
//   createProxyMiddleware({
//     target: process.env.PRODUCT_SERVICE_URL,
//     changeOrigin: true,
//     secure: true,
//     onProxyReq: (proxyReq, req) => {
//       if (req.headers.cookie) {
//         proxyReq.setHeader("cookie", req.headers.cookie);
//       }
//     },
//   })
// );

// // HEALTH CHECK
// app.get("/", (req, res) => {
//   res.send("API Gateway Running 🚀");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`API Gateway running on ${PORT}`);
// });