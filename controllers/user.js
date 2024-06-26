const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registerUser = await User.register(newUser, password);
    req.flash("success", "Registration successful ! Welcome to Wanderlust");
    console.log("New User Registered");
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash(
        "success",
        `Congrats ${username
          .toString()
          .toUpperCase()}🎉! You are Welcome to Wanderlust !`
      );
     let redirectUrl = res.locals.redirectUrl || "/listing" ;
     return res.redirect(redirectUrl);
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash(
    "success",
    `Welcome back ${req.body.username
      .toString()
      .toUpperCase()} ! You logged in successfully`
  );
  let redirectUrl = res.locals.redirectUrl || "/listing" ;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  //  console.log(req.user);-----> has access shows users
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "You are logged-out Successfully, Get back soon.");
      // console.log(req.user);----->User deleted from session
      res.redirect("/login");
    }
  });
};
