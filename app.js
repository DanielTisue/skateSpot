require("dotenv").config({ path: '.env' });
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Skatespot = require("./models/skatespot"),
  Comment = require("./models/comment"),
  User = require("./models/user");


//require routes
const commentRoutes = require("./routes/comments"),
  skatespotRoutes = require("./routes/skatespots"),
  authRoutes = require("./routes/auth");

//db config
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Database is connected!');
})

app.use(express.json({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
app.use("/skatespots", skatespotRoutes);
app.use("/skatespots/:id/comments", commentRoutes);

app.get("/", (req, res) => {
  res.render("landing");
});

app.listen(process.env.PORT || 3000, () => {
   console.log("Server Started!");
 });
