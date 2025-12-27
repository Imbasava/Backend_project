const followModel = require("../models/follow");
const logger = require("../utils/logger");

const follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.id);

    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    await followModel.followUser(followerId, followingId);
    res.json({ message: "User followed successfully" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

const unfollow = async (req, res) => {
  try {
    await followModel.unfollowUser(req.user.id, req.params.id);
    res.json({ message: "User unfollowed successfully" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};

const getMyFollowing = async (req, res) => {
  try {
    const users = await followModel.getFollowing(req.user.id);
    res.json(users);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Failed to fetch following" });
  }
};

const getMyFollowers = async (req, res) => {
  try {
    const users = await followModel.getFollowers(req.user.id);
    res.json(users);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Failed to fetch followers" });
  }
};


const { findUsersByName } = require("../models/user");

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const users = await findUsersByName(q, limit, offset);

    res.json({
      users,
      pagination: {
        page,
        limit,
        hasMore: users.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Search users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const { getFollowCounts } = require("../models/follow");

const getMyStats = async (req, res) => {
  try {
    const stats = await getFollowCounts(req.user.id);
    res.json(stats);
  } catch (error) {
    logger.critical("Get user stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  searchUsers,
  getMyStats,
};
