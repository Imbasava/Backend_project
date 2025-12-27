const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 */

// Like a post
const likePost = async (userId, postId) => {
  return query(
    `INSERT INTO likes (user_id, post_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, postId]
  );
};

// Unlike a post
const unlikePost = async (userId, postId) => {
  return query(
    `DELETE FROM likes
     WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
};

// Get users who liked a post
const getPostLikes = async (postId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM likes l
     JOIN users u ON l.user_id = u.id
     WHERE l.post_id = $1`,
    [postId]
  );
  return result.rows;
};

// Get posts liked by a user
const getUserLikes = async (userId) => {
  const result = await query(
    `SELECT p.id, p.content, p.created_at
     FROM likes l
     JOIN posts p ON l.post_id = p.id
     WHERE l.user_id = $1 AND p.is_deleted = false`,
    [userId]
  );
  return result.rows;
};

// Check if user has liked a post
const hasUserLikedPost = async (userId, postId) => {
  const result = await query(
    `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
  hasUserLikedPost,
};
