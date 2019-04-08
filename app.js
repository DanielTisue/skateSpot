const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const Skatespot = require("./models/skatespot");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");

//require routes
const commentRoutes = require("./routes/comments");
const skatespotRoutes = require("./routes/skatespots");
const authRoutes      = require("./routes/auth");

mongoose.connect("mongodb://localhost:27017/slam_spot", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
seedDB();

//Passport Config
app.use(require("express-session")({
    secret: "Max is feeling better!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/", authRoutes);
app.use("/skateSpots", skatespotRoutes);
app.use("/skateSpots/:id/comments", commentRoutes);

app.get('/', (req, res) => {
 res.render('landing'); 
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!");
});