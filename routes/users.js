const express = require("express");
const UserController = require("../controllers/UsersController");
const { body } = require("express-validator");

const router = express.Router();

router.post("/create-profile", UserController.createProfile);

module.exports = router;
