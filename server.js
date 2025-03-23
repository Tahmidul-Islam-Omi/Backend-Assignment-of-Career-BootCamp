const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const todoRoutes = require("./routes/todos");
const authRoutes = require("./routes/auth");
const db = require("./config/db"); // Import the database connection
const swaggerDocs = require("./config/swagger"); // Import Swagger config

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser()); // Add cookie-parser middleware

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Todo API" });
});

// Initialize Swagger
swaggerDocs(app);

// Start server only if database connection is successful
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
};

// Check database connection before starting server
db.query('SELECT 1')
  .then(() => {
    console.log('Database connection verified');
    startServer();
  })
  .catch(err => {
    console.error('Server not started due to database connection issue:', err);
  });

module.exports = app;
