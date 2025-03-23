const db = require("../config/db");

/**
 * Get all todos for a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} Array of todo objects
 */
async function getTodosByUserId(userId) {
    const sql = "SELECT * FROM todos WHERE user_id = $1 ORDER BY id DESC";
    const result = await db.query(sql, [userId]);
    return result.rows;
}

/**
 * Get a single todo by id (ensuring it belongs to the user)
 * @param {number} todoId - The ID of the todo
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} Todo object if found, undefined otherwise
 */
async function getTodoByIdAndUserId(todoId, userId) {
    const sql = "SELECT * FROM todos WHERE id = $1 AND user_id = $2";
    const result = await db.query(sql, [todoId, userId]);
    return result.rows[0];
}

/**
 * Create a new todo for a user
 * @param {string} title - The title of the todo
 * @param {string} description - The description of the todo
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} Created todo object
 */
async function createTodo(title, description, userId) {
    const sql = "INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING *";
    const result = await db.query(sql, [title, description, userId]);
    return result.rows[0];
}

/**
 * Update a todo (ensuring it belongs to the user)
 * @param {number} todoId - The ID of the todo
 * @param {string} title - The updated title
 * @param {string} description - The updated description
 * @param {boolean} completed - The updated completion status
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} Updated todo object if found, undefined otherwise
 */
async function updateTodo(todoId, title, description, completed, userId) {
    const sql = "UPDATE todos SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *";
    const result = await db.query(sql, [title, description, completed, todoId, userId]);
    return result.rows[0];
}

/**
 * Delete a todo (ensuring it belongs to the user)
 * @param {number} todoId - The ID of the todo
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} Deleted todo object if found, undefined otherwise
 */
async function deleteTodo(todoId, userId) {
    const sql = "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await db.query(sql, [todoId, userId]);
    return result.rows[0];
}

module.exports = {
    getTodosByUserId,
    getTodoByIdAndUserId,
    createTodo,
    updateTodo,
    deleteTodo
};