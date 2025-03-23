const db = require("../config/db");

/**
 * Store a new refresh token in the database
 * @param {number} userId - The ID of the user
 * @param {string} refreshToken - The refresh token string
 * @param {Date} expiryDate - The token's expiration date
 * @returns {Promise<Object>} Stored refresh token object
 */
async function storeRefreshToken(userId, refreshToken, expiryDate) {
    const sql = "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *";
    const result = await db.query(sql, [userId, refreshToken, expiryDate]);
    return result.rows[0];
}

/**
 * Find a refresh token in the database
 * @param {string} token - The refresh token string to find
 * @returns {Promise<Object>} Refresh token object if found, undefined otherwise
 */
async function findRefreshToken(token) {
    const sql = "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()";
    const result = await db.query(sql, [token]);
    return result.rows[0];
}

/**
 * Delete a refresh token from the database
 * @param {string} token - The refresh token to delete
 * @returns {Promise<Object>} Deleted refresh token object if found, undefined otherwise
 */
async function deleteRefreshToken(token) {
    const sql = "DELETE FROM refresh_tokens WHERE token = $1 RETURNING *";
    const result = await db.query(sql, [token]);
    return result.rows[0];
}

/**
 * Rotate a refresh token (delete old one and create new one)
 * @param {string} oldToken - The old refresh token to invalidate
 * @param {string} newToken - The new refresh token to store
 * @param {Date} newExpiryDate - The new token's expiration date
 * @returns {Promise<Object>} New refresh token object
 */
async function rotateRefreshToken(oldToken, newToken, newExpiryDate) {
    // Start a transaction
    await db.query('BEGIN');
    try {
        // Delete old token
        const oldTokenResult = await deleteRefreshToken(oldToken);
        if (!oldTokenResult) {
            throw new Error('Old token not found');
        }
        
        // Store new token
        const newTokenResult = await storeRefreshToken(oldTokenResult.user_id, newToken, newExpiryDate);
        
        // Commit transaction
        await db.query('COMMIT');
        return newTokenResult;
    } catch (error) {
        // Rollback in case of error
        await db.query('ROLLBACK');
        throw error;
    }
}

module.exports = {
    storeRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    rotateRefreshToken
};