import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *       properties:
 *         email:
 *           type: string
 *           example: "user@gmail.com"
 *         password:
 *           type: string
 *           example: "12345678"
 *         username:
 *           type: string
 *           example: "benbenf"
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "user@gmail.com"
 *         password:
 *           type: string
 *           example: "12345678"
 *
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGc...abc"
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGc...xyz"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *                 tokens:
 *                   $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Unexpected error
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email & password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Incorrect email or password
 *       500:
 *         description: Unexpected error
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout (invalidate refresh token)
 *     tags: [Auth]
 *     description: "Provide refresh token in Authorization header: Bearer <refreshToken>"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Missing or invalid refresh token
 *       500:
 *         description: Unexpected error
 */
router.get("/logout", authController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     description: "Provide refresh token in Authorization header: Bearer <refreshToken>"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Missing or invalid refresh token
 *       500:
 *         description: Unexpected error
 */
router.get("/refresh", authController.refresh);

export default router;
