const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');

// Helper function to generate tokens
function generateTokens(user) {
    // Create access token (short-lived, e.g., 15 minutes)
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    
    // Create refresh token (long-lived, e.g., 7 days)
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    return {
        accessToken,
        refreshToken,
        refreshTokenExpiry
    };
}

// Register a new user
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide name, email, and password' });
        }
        
        // Check if user already exists
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const newUser = await userModel.createUser(name, email, hashedPassword);
        
        // Generate tokens
        const { accessToken, refreshToken, refreshTokenExpiry } = generateTokens(newUser);
        
        // Store refresh token in database
        await refreshTokenModel.storeRefreshToken(newUser.id, refreshToken, refreshTokenExpiry);
        
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Login user
async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }
        
        // Check if user exists
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Generate tokens
        const { accessToken, refreshToken, refreshTokenExpiry } = generateTokens(user);
        
        // Store refresh token in database
        await refreshTokenModel.storeRefreshToken(user.id, refreshToken, refreshTokenExpiry);
        
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Logout user
async function logout(req, res) {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            // Delete refresh token from database
            await refreshTokenModel.deleteRefreshToken(refreshToken);
            
            // Clear refresh token cookie
            res.clearCookie('refreshToken');
        }
        
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Refresh access token using refresh token
async function refreshAccessToken(req, res) {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        
        // Find the refresh token in the database
        const tokenDoc = await refreshTokenModel.findRefreshToken(refreshToken);
        
        if (!tokenDoc) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }
        
        // Get user details
        const user = await userModel.findUserById(tokenDoc.user_id);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        // Generate new tokens (token rotation for better security)
        const { accessToken, refreshToken: newRefreshToken, refreshTokenExpiry } = generateTokens(user);
        
        // Rotate refresh token (delete old, create new)
        await refreshTokenModel.rotateRefreshToken(refreshToken, newRefreshToken, refreshTokenExpiry);
        
        // Set new refresh token as HTTP-only cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(200).json({
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken
};