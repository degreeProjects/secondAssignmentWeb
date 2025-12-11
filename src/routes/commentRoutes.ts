import { Router } from "express";
import commentController from "../controllers/commentController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 *
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         post:
 *           type: string
 *         sender:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateComment:
 *       type: object
 *       required:
 *         - content
 *         - post
 *         - sender
 *       properties:
 *         content:
 *           type: string
 *           example: "This is a comment"
 *         post:
 *           type: string
 *           example: "673be932f8c1e129ce31a2b9"
 *         sender:
 *           type: string
 *           example: "673be92ff8c1e129ce31a2a1"
 *
 *     UpdateComment:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           example: "Updated comment text"
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 *       500:
 *         description: Failed to get all comments
 */
router.get("/", commentController.getAll.bind(commentController));

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Post ID
 *     responses:
 *       200:
 *         description: List of comments for a post
 *       500:
 *         description: Failed to get comments by post
 */
router.get(
  "/post/:postId",
  commentController.getByPost.bind(commentController)
);

/**
 * @swagger
 * /comments/sender/{senderId}:
 *   get:
 *     summary: Get comments by sender ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sender user ID
 *     responses:
 *       200:
 *         description: List of comments by sender
 *       500:
 *         description: Failed to get comments by sender
 */
router.get(
  "/sender/:senderId",
  commentController.getBySender.bind(commentController)
);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment found
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Failed to get comment by id
 */
router.get("/:id", commentController.getById.bind(commentController));

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - post
 *               - sender
 *             properties:
 *               content:
 *                 type: string
 *               post:
 *                 type: string
 *               sender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create comment
 */
router.post("/", commentController.create.bind(commentController));

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
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
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Failed to update comment
 */
router.put("/:id", commentController.update.bind(commentController));

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Failed to delete comment
 */
router.delete("/:id", commentController.delete.bind(commentController));

export default router;
