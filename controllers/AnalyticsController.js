const {
  getPageInsights,
  getPostInsights,
  getPostId,
} = require("../services/facebook");

const AnalyticsController = {
  getPageInsights: async (req, res) => {
    try {
      console.log("getPageInsights");
      const data = await getPageInsights();
      console.log("data", data);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getPostId: async (req, res) => {
    try {
      const data = await getPostId();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getPostInsights: async (req, res) => {
    console.log("getPostInsights", req.params);
    try {
      const { postId } = req.params;
      const data = await getPostInsights(postId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = AnalyticsController;
