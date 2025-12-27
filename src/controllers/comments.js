const commentModel = require("../models/comment");
const logger = require("../utils/logger");

const { query } = require("../utils/database");


// Create comment
const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id, content } = req.body;

    // 🔒 Check if comments are enabled for this post
    const postResult = await query(
      `SELECT comments_enabled FROM posts WHERE id = $1 AND is_deleted = false`,
      [post_id]
    );

    if (!postResult.rows.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!postResult.rows[0].comments_enabled) {
      return res.status(403).json({
        error: "Comments are disabled for this post",
      });
    }

    // ✅ Create comment only if enabled
    const comment = await commentModel.createComment(
      userId,
      post_id,
      content
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    logger.critical("Create comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Update comment
const updateComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;
    const { content } = req.body;

    const success = await commentModel.updateComment(
      parseInt(comment_id),
      userId,
      content
    );

    if (!success) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    logger.critical("Update comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;

    const success = await commentModel.deleteComment(
      parseInt(comment_id),
      userId
    );

    if (!success) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.critical("Delete comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get comments for a post
const getPostComments = async (req, res) => {
  try {
    const { post_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const comments = await commentModel.getPostComments(
      parseInt(post_id),
      limit,
      offset
    );

    res.json({
      comments,
      pagination: {
        page,
        limit,
        hasMore: comments.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get post comments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
};
