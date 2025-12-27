const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const likesController = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 */

// Like a post
router.post("/:post_id", authenticateToken, likesController.likePost);

// Unlike a post
router.delete("/:post_id", authenticateToken, likesController.unlikePost);

// Get likes for a post
router.get("/post/:post_id", authenticateToken, likesController.getPostLikes);

// Get posts liked by a user
router.get("/user/:user_id", authenticateToken, likesController.getUserLikes);

module.exports = router;
