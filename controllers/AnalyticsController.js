const {
  getPageInsights,
  getPostInsights,
  getPostId,
} = require("../services/facebook");
const { getAccessToken } = require("../services/token");

const AnalyticsController = {
  getPageInsights: async (req, res) => {
    try {
      const token = await getAccessToken(req.userId);

      const data = await getPageInsights(token);

      res.json(data);
    } catch (error) {
      console.log("error", error);
      res.status(error.status || 500).json({ error: error.message });
    }
  },
  getPostId: async (req, res) => {
    try {
      const token = await getAccessToken(req.userId);
      const data = await getPostId(token);

      res.json(data);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  },
  getPostInsights: async (req, res) => {
    try {
      const token = await getAccessToken(req.userId);
      const { postId } = req.params;
      const data = await getPostInsights(postId, token);
      res.json(data);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  },
};

module.exports = AnalyticsController;
