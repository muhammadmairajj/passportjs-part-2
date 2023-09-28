const express = require("express");
const passport = require("passport");
const { UserRegister, LoginUser, getProfileData } = require("../controllers/authenticate-controller");
const User = require("../models/authenticate");

const router = express.Router();

// Register Route
router.post("/signup", UserRegister);

// Login Route
router.post("/login", LoginUser);

// get Profile route authenticate
router.get('/profile', passport.authenticate('jwt', {session: false}), getProfileData);

module.exports = router;