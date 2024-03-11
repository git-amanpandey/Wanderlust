const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');

//signup-route
router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let xyz = await User.register(newUser, password);
      req.flash("success", "Registration successful ! Welcome to Wanderlust");
      res.redirect("/listing");
      console.log(xyz);
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

//login-route
router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success",`Welcome back ${req.body.username.toString().toUpperCase()} ! You logged in successfully`);
    res.redirect("/listing");
    
  })
);

module.exports = router;
