/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The title of the todo
 *         description:
 *           type: string
 *           description: The description of the todo
 *         completed:
 *           type: boolean
 *           description: Whether the todo is completed
 *           default: false
 *         user_id:
 *           type: integer
 *           description: The id of the user who owns this todo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the todo was created
 *       example:
 *         id: 1
 *         title: Complete project
 *         description: Finish the todo app project
 *         completed: false
 *         user_id: 1
 *         created_at: 2023-06-01T12:00:00Z
 *     
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john@example.com
 *     
 *     RefreshToken:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the refresh token
 *         user_id:
 *           type: integer
 *           description: The id of the user who owns this token
 *         token:
 *           type: string
 *           description: The refresh token string
 *         expires_at:
 *           type: string
 *           format: date-time
 *           description: The expiration date of the token
 *       example:
 *         id: 1
 *         user_id: 1
 *         token: a1b2c3d4e5f6g7h8i9j0
 *         expires_at: 2023-06-08T12:00:00Z
 */