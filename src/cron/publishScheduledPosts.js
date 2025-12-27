const cron = require("node-cron");
const { query } = require("../utils/database");
const logger = require("../utils/logger");

const startScheduledPostJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await query(`
        UPDATE posts
        SET scheduled_at = NULL
        WHERE scheduled_at IS NOT NULL
          AND scheduled_at <= NOW()
      `);

      logger.verbose("Scheduled posts published");
    } catch (err) {
      logger.critical("Scheduled post cron failed", err);
    }
  });
};

module.exports = startScheduledPostJob;
