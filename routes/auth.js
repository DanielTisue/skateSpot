const express =   require("express"),
      router  =   express.Router(),
      passport =  require("passport"),
      User =      require("../models/user");


// RESGISTER: show register form
router.get("/register", (req, res) => {
   res.render("register", {page: 'register'}); 
});
//Handle sign up logic:
router.post("/register", (req, res) => {
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
router.get("/login", (req, res) => {
  res.render("login", {page: 'login'}); 
});
// LOGIN: Handling login logic:
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/skateSpots",
        failureRedirect: "/login"
    }), function(req, res){
});

//  ===========

// LOGOUT logic + route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/skateSpots");
});


module.exports = router;