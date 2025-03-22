const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all todo routes
router.use(authMiddleware);

// GET all todos for the authenticated user
router.get("/", todoController.getAllTodos);

// GET a single todo by ID (only if it belongs to the user)
router.get("/:id", todoController.getTodoById);

// CREATE a new todo for the authenticated user
router.post("/", todoController.createTodo);

// UPDATE a todo (only if it belongs to the user)
router.put("/:id", todoController.updateTodo);

// DELETE a todo (only if it belongs to the user)
router.delete("/:id", todoController.deleteTodo);

module.exports = router;