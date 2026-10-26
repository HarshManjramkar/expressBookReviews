const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for authentication
app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware for protected review routes
const authMiddleware = function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    const token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else if (req.headers.authorization) {
    const token = req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : req.headers.authorization;
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
};

app.use("/customer/auth/*", authMiddleware);
app.use("/auth/*", authMiddleware);

const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
