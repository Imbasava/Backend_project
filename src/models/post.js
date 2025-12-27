const { query } = require("../utils/database");

/**
 * Post model for database operations
 */

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */

const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
  scheduled_at = null,
}) => {
  const result = await query(
    `INSERT INTO posts (
      user_id,
      content,
      media_url,
      comments_enabled,
      created_at,
      scheduled_at,
      is_deleted
    )
    VALUES ($1, $2, $3, $4, NOW(), $5, false)
    RETURNING id, user_id, content, media_url, comments_enabled, scheduled_at, created_at`,
    [user_id, content, media_url, comments_enabled, scheduled_at]
  );

  return result.rows[0];
};

/**
 * Get post by ID
 * @param {number} postId - Post ID
 * @returns {Promise<Object|null>} Post object or null
 */
const getPostById = async (postId) => {
  const result = await query(
  `
  SELECT 
    p.*,
    u.username,
    u.full_name,
    COUNT(DISTINCT l.id) AS like_count,
    COUNT(DISTINCT c.id) AS comment_count
  FROM posts p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN likes l ON l.post_id = p.id
  LEFT JOIN comments c ON c.post_id = p.id AND c.is_deleted = false
  WHERE p.id = $1 AND p.is_deleted = false
  GROUP BY p.id, u.id
  `,
  [postId]
);

  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 and p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return result.rows;
};

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = true WHERE id = $1 AND user_id = $2",
    [postId, userId],
  );

  return result.rowCount > 0;
};

// TODO: Implement getFeedPosts function that returns posts from followed users

// This should include pagination and ordering by creation date


const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `
    SELECT 
      p.id,
      p.content,
      p.media_url,
      p.comments_enabled,
      p.created_at,
      u.id AS user_id,
      u.username,
      u.full_name,

      COUNT(DISTINCT l.id) AS like_count,
      COUNT(DISTINCT c.id) AS comment_count,
      BOOL_OR(l.user_id = $1) AS user_liked

    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id AND c.is_deleted = false

    WHERE p.is_deleted = false
      AND (
        p.user_id = $1 OR
        p.user_id IN (
          SELECT following_id FROM follows WHERE follower_id = $1
        )
      ) AND (p.scheduled_at IS NULL OR p.scheduled_at <= NOW())


    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [userId, limit, offset]
  );

  return result.rows;
};





// TODO: Implement updatePost function for editing posts

// TODO: Implement searchPosts function for content search

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
    getFeedPosts, // ✅ add
};
