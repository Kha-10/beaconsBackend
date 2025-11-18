const express = require("express");
const AnalyticsController = require("../controllers/AnalyticsController");
const { body } = require("express-validator");

const router = express.Router();

router.get("/", AnalyticsController.getPageInsights);

router.get("/posts", AnalyticsController.getPostId);

router.get("/posts/:postId", AnalyticsController.getPostInsights);

module.exports = router;
