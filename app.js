if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const search = require('./routes/search.js');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => console.log("Connected With Database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.engine("ejs", engine);
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // Set up ejs for templating
app.set("views", path.join(__dirname, "/views")); // Point to the folder where our views are located
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbUrl,
      touchAfter: 24 * 3600 ,// time period in seconds
      crypto: {
        secret: process.env.SECRET,
      }
    }),
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
// USing connect-flash for displaying msg:
app.use(flash());

//Passport-Local-Use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

//Normal Route
app.get("/", (req, res) => {
  res.redirect("/listing");
});
//All user route
app.use("/", userRouter);
//All Listing Routes
app.use("/listing", listingRouter);
//All Review Routes
app.use("/listing/:id/reviews", reviewRouter);
//Search-Icons
app.use("/search", search);
//Middleware last
app.all("*",(req,res,next)=>{
  throw new ExpressError(400,"NO PAGE FOUND !");
  next();
});
//Error-Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  // res.status(status).send(message);
  res.render("./listings/error.ejs", { message, status });
});

//Server Started
const port = 8080;
app.listen(port, () => console.log(`Server is running on ${port}`));
