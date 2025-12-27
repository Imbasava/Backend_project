const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const commentsController = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 */

// Create a comment
router.post("/", authenticateToken, commentsController.createComment);

// Update a comment
router.put("/:comment_id", authenticateToken, commentsController.updateComment);

// Delete a comment
router.delete("/:comment_id", authenticateToken, commentsController.deleteComment);

// Get comments for a post
router.get("/post/:post_id", authenticateToken, commentsController.getPostComments);

module.exports = router;
