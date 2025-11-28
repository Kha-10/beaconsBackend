const express = require("express");
const UserController = require("../controllers/UsersController");
const SocialAccountsController = require("../controllers/SocialAccountsController");
const authMiddleware = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router();

// router.get("/me", UserController.index);

router.post("/create-profile", UserController.createProfile);

router.post("/facebook/callback", authMiddleware, SocialAccountsController.create);

module.exports = router;
