const express = require("express");
const AnalyticsController = require("../controllers/AnalyticsController");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, AnalyticsController.getPageInsights);

router.get("/posts", authMiddleware, AnalyticsController.getPostId);

router.get(
  "/posts/:postId",
  authMiddleware,
  AnalyticsController.getPostInsights
);

module.exports = router;
