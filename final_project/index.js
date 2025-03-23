const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Secret key for JWT verification
const secretKey = "your_secret_key_here"; // 🔐 Add your own secure key

// Middleware to parse JSON request bodies
app.use(express.json());

// Session middleware for customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Auth middleware for protected customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  // Remove "Bearer " if present
  const tokenWithoutBearer = token.split(' ')[1] || token;

  jwt.verify(tokenWithoutBearer, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.user = decoded; // attach user info
    next();
  });
});

// Route definitions
app.use("/customer", customer_routes); // Authenticated routes (e.g., login, review)
app.use("/", genl_routes);             // Public routes (e.g., register, get books)

const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
