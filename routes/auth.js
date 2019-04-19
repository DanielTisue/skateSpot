const express = require("express");
let router  = express.Router();
const passport = require("passport");
const User = require("../models/user");


//  ===========
// AUTH ROUTES
//  ===========

// RESGISTER: show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    // req.body.username;
    //req.body.password;
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
          res.redirect("/skateSpots"); 
        });
    });
});

//  ===========

// LOGIN: show login form
router.get("/login", function(req, res){
  res.render("login"); 
});
// LOGIN: handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/skateSpots",
        failureRedirect: "/login"
    }), function(req, res){
});

//  ===========

// LOGOUT logic route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/skateSpots");
});


module.exports = router;