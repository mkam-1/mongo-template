const express = require("express");
const postController = require("../../../controllers/post");
const validate = require("../../../middlewares/validate");
const { createPostSchema, updatePostSchema } = require("../../../validation/post");

const router = express.Router();

router.post("/", validate(createPostSchema), postController.create);
router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.put("/:id", validate(updatePostSchema), postController.update);
router.delete("/:id", postController.deletePost);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: User Posts
 *   description: Post management APIs for simple user
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the post
 *         title:
 *           type: string
 *         content:
 *           type: string
 *       example:
 *         id: "12345"
 *         title: "My first post"
 *         content: "This is the body of the post"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [User Posts]
 *     security:
 *       - bearerAuth: []   # Requires JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first post
 *               content:
 *                 type: string
 *                 example: This is the body of the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *
 *   get:
 *     summary: Get all posts
 *     tags: [User Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [User Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *
 *   put:
 *     summary: Update a post by ID
 *     tags: [User Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated title
 *               content:
 *                 type: string
 *                 example: Updated content body
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Post not found
 *
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [User Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
