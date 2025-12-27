const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const usersController = require("../controllers/users");

const router = express.Router();

/**
 * User-related routes
 */

// Follow stats
router.get("/me/stats", authenticateToken, usersController.getMyStats);

// Find people
router.get("/search", authenticateToken, usersController.searchUsers);


// Follow a user
router.post("/:id/follow", authenticateToken, usersController.follow);

// Unfollow a user
router.post("/:id/unfollow", authenticateToken, usersController.unfollow);

// Get users that current user is following
router.get("/me/following", authenticateToken, usersController.getMyFollowing);

// Get users that follow current user
router.get("/me/followers", authenticateToken, usersController.getMyFollowers);



module.exports = router;
