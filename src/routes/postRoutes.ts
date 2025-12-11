import PostController from "../controllers/postController";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         sender:
 *           type: string
 *           description: User ID of the sender
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreatePost:
 *       type: object
 *       required:
 *         - description
 *         - location
 *         - sender
 *       properties:
 *         description:
 *           type: string
 *           example: "Having a great day!"
 *         location:
 *           type: string
 *           example: "Tel Aviv"
 *         sender:
 *           type: string
 *           description: User ID
 *           example: "67a1d205c689f9a4e5476a1b"
 *
 *     UpdatePost:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         location:
 *           type: string
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Failed to get posts
 */
router.get("/", PostController.getAll.bind(PostController));

/**
 * @swagger
 * /posts/sender:
 *   get:
 *     summary: Get posts by sender ID
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: senderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post sender
 *     responses:
 *       200:
 *         description: List of posts sent by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: senderId missing
 *       500:
 *         description: Failed to get posts
 */
router.get("/sender", PostController.getBySender.bind(PostController));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to get post
 */
router.get("/:id", PostController.getById.bind(PostController));

/**
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create post
 */
router.post("/", PostController.create.bind(PostController));

/**
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       200:
 *         description: Post updated
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to update post
 *
 */
router.put("/:id", PostController.update.bind(PostController));

/**
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to delete post
 */
router.delete("/:id", PostController.delete.bind(PostController));

export default router;
