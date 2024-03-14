const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const userController = require('../controllers/user');

//signup-route
router.route("/signup")
.get( userController.signupForm)
.post(wrapAsync(userController.signup));

//login-route
router.route("/login")
.get(userController.loginForm)
.post(passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),wrapAsync(userController.login));

router.get("/logout",userController.logout);

module.exports = router;
