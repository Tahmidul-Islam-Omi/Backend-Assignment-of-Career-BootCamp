const db = require("../config/db");

/**
 * Create a new user in the database
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address
 * @param {string} hashedPassword - The user's hashed password
 * @returns {Promise<Object>} Created user object (excluding password)
 */
async function createUser(name, email, hashedPassword) {
    const sql = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email";
    const result = await db.query(sql, [name, email, hashedPassword]);
    return result.rows[0];
}

/**
 * Find a user by their email address
 * @param {string} email - The email address to search for
 * @returns {Promise<Object>} User object if found (including password), undefined otherwise
 */
async function findUserByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(sql, [email]);
    return result.rows[0];
}

/**
 * Find a user by their ID
 * @param {number} id - The user ID to search for
 * @returns {Promise<Object>} User object if found (excluding password), undefined otherwise
 */
async function findUserById(id) {
    const sql = "SELECT id, name, email FROM users WHERE id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0];
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};