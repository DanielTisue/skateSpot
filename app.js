require("dotenv").config();
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Skatespot = require("./models/skatespot"),
  Comment = require("./models/comment"),
  User = require("./models/user");
 // seedDB = require("./seeds");

//require routes
const commentRoutes = require("./routes/comments"),
  skatespotRoutes = require("./routes/skatespots"),
  authRoutes = require("./routes/auth");

mongoose.connect("mongodb://localhost/slam_spot", { useNewUrlParser: true });
mongoose.connection
  .once("open", function() {
    console.log("Connection to DB made");
  })
  .on("error", function(error) {
    console.log("Connection error:", error);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passport Config
app.use(
  require("express-session")({
    secret: "Max is feeling better!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", authRoutes);
app.use("/skateSpots", skatespotRoutes);
app.use("/skateSpots/:id/comments", commentRoutes);

app.get("/", (req, res) => {
  res.render("landing");
});

app.listen(3000, () => {
  console.log("Server Started!");
});
