const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const todoRoutes = require("./routes/todos");
const authRoutes = require("./routes/auth");
const db = require("./config/db"); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Todo API" });
});

// Start server only if database connection is successful
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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
