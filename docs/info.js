/**
 * @swagger
 * info:
 *   title: Todo API
 *   description: |
 *     This is a RESTful API for a Todo application with user authentication.
 *     
 *     ## Features
 *     
 *     - User registration and authentication
 *     - JWT-based authentication with refresh tokens
 *     - CRUD operations for todos
 *     - Secure password storage with bcrypt
 *     
 *     ## Authentication
 *     
 *     The API uses JWT for authentication. To access protected endpoints, you need to:
 *     
 *     1. Register a new user or login with existing credentials
 *     2. Use the returned access token in the Authorization header as a Bearer token
 *     3. When the access token expires, use the refresh token to get a new one
 *     
 *   version: 1.0.0
 *   contact:
 *     name: API Support
 *     email: tahmidulislamomi09@gmail.com
 * 
 * servers:
 *   - url: http://localhost:3001
 *     description: Development server
 */