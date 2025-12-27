const { query } = require("../utils/database");

/**
 * Comment model for managing post comments
 */

// Create a comment
const createComment = async (userId, postId, content) => {
  const result = await query(
    `INSERT INTO comments (user_id, post_id, content, created_at, is_deleted)
     VALUES ($1, $2, $3, NOW(), false)
     RETURNING id, user_id, post_id, content, created_at`,
    [userId, postId, content]
  );
  return result.rows[0];
};

// Update a comment (only owner)
const updateComment = async (commentId, userId, content) => {
  const result = await query(
    `UPDATE comments
     SET content = $1
     WHERE id = $2 AND user_id = $3 AND is_deleted = false`,
    [content, commentId, userId]
  );
  return result.rowCount > 0;
};

// Soft delete comment
const deleteComment = async (commentId, userId) => {
  const result = await query(
    `UPDATE comments
     SET is_deleted = true
     WHERE id = $1 AND user_id = $2`,
    [commentId, userId]
  );
  return result.rowCount > 0;
};

// Get comments for a post (with pagination)
const getPostComments = async (postId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT c.id, c.content, c.created_at,
            u.id AS user_id, u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1 AND c.is_deleted = false
     ORDER BY c.created_at ASC
     LIMIT $2 OFFSET $3`,
    [postId, limit, offset]
  );
  return result.rows;
};

// Get comment by ID
const getCommentById = async (commentId) => {
  const result = await query(
    `SELECT * FROM comments WHERE id = $1`,
    [commentId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
  getCommentById,
};
