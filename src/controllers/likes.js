const likeModel = require("../models/like");
const logger = require("../utils/logger");

// Like a post
const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    await likeModel.likePost(userId, postId);

    res.json({ message: "Post liked successfully" });
  } catch (error) {
    logger.critical("Like post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    await likeModel.unlikePost(userId, postId);

    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    logger.critical("Unlike post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get likes for a post
const getPostLikes = async (req, res) => {
  try {
    const postId = parseInt(req.params.post_id);
    const likes = await likeModel.getPostLikes(postId);

    res.json({ likes, count: likes.length });
  } catch (error) {
    logger.critical("Get post likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get posts liked by a user
const getUserLikes = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    const posts = await likeModel.getUserLikes(userId);

    res.json({ posts });
  } catch (error) {
    logger.critical("Get user likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
};
