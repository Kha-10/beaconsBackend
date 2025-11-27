const express = require("express");
const UserController = require("../controllers/UsersController");
const SocialAccountsController = require("../controllers/SocialAccountsController");
const { body } = require("express-validator");

const router = express.Router();

router.post("/create-profile", UserController.createProfile);

router.post("/facebook/callback", SocialAccountsController.get);

module.exports = router;
