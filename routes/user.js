const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirect } = require("../middleware.js");
const { signup, signupPost, loginPost, login, logout } = require("../controllers/users.js");

router.route("/signup")
.get( signup)
.post( signupPost);


router.route("/login")
.get( login)
.post( saveredirect, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), loginPost);


router.get("/logout", logout);

module.exports = router;