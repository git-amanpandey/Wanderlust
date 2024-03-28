const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const userController = require('../controllers/user');
const {saveRedirectUrl} = require('../middleware.js');
//signup-route
router.route("/signup")
.get( userController.signupForm)
.post(saveRedirectUrl,wrapAsync(userController.signup));

//login-route
router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),wrapAsync(userController.login));

router.get("/logout",userController.logout);

module.exports = router;
