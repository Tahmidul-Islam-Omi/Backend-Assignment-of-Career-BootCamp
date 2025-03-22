const todoModel = require("../models/todoModel");

// Get all todos for the authenticated user
async function getAllTodos(req, res) {
    try {
        const userId = req.user.id; // This will come from the auth middleware
        const todos = await todoModel.getTodosByUserId(userId);

        if (todos.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Get a single todo by ID (only if it belongs to the user)
async function getTodoById(req, res) {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;

        const todo = await todoModel.getTodoByIdAndUserId(todoId, userId);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Create a new todo for the authenticated user
async function createTodo(req, res) {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const newTodo = await todoModel.createTodo(title, description || "", userId);
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Update a todo (only if it belongs to the user)
async function updateTodo(req, res) {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;
        const { title, description, completed } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const updatedTodo = await todoModel.updateTodo(
            todoId,
            title,
            description || "",
            completed !== undefined ? completed : false,
            userId
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found or you don't have permission to update it" });
        }

        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Delete a todo (only if it belongs to the user)
async function deleteTodo(req, res) {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;

        const deletedTodo = await todoModel.deleteTodo(todoId, userId);

        if (!deletedTodo) {
            return res.status(404).json({ error: "Todo not found or you don't have permission to delete it" });
        }

        res.status(200).json(deletedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};