const db = require("../config/db");

// Create a new user
async function createUser(name, email, hashedPassword) {
    const sql = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email";
    const result = await db.query(sql, [name, email, hashedPassword]);
    return result.rows[0];
}

// Find user by email
async function findUserByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(sql, [email]);
    return result.rows[0];
}

// Find user by id
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