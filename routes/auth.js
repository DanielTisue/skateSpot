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
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
          req.flash("error", "Username already exists!")
          res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
          req.flash("success", `You're successfully signed up! Welcome to Skate Spots ${newUser.username}!`);
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
  req.flash("success", "LOGGED OUT - Successfully");
  res.redirect("/skateSpots");
});


module.exports = router;