const express =         require("express"),
      router =          express.Router({mergeParams: true}),
      Skatespot =       require("../models/skatespot"),
      middlewareObj =      require("../middleware/index");

//INDEX
router.get('/', (req,res) => {
    Skatespot.find({}, (err, allSkatespots) => {
    if(err){
        console.log(err);
    } else {
        res.render('skatespots/index', {skatespots: allSkatespots, page: 'skatespots', currentUser: req.user}); 
    }
  });
});

//CREATE Skatespot
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
    // get data from form and add to skatespots array
    const name = req.body.name,
          image = req.body.image,
          desc = req.body.description,
          location = req.body.location,
          author = 
                    {
                        id: req.user._id,
                        username: req.user.username
                    };
    const newSkatespot = {name: name, image: image, description: desc, location: location, author: author};
    
    // Create a new skatespot and save to DB
    Skatespot.create(newSkatespot, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            //redirect back to skatespots page
            res.redirect("skatespots");
        }
    });
});

//NEW - show form to create new skatespot
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
   res.render("skatespots/new"); 
});

//SHOW page
router.get("/:id", (req, res) => {
    Skatespot.findById(req.params.id).populate("comments").exec((err, foundSkatespot) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundSkatespot);
            //render show template with that skatespot
            res.render("skatespots/show", {skatespot: foundSkatespot});
        }
    });
});

// EDIT: SkateSpots
router.get("/:id/edit", middlewareObj.checkSkatespotOwnership, (req, res) => {
    Skatespot.findById(req.params.id, (err, foundSkatespot) => {
        if(err) {
            res.redirect("/skatespots");
        } else {
            res.render("skatespots/edit", { skatespot: foundSkatespot });
        }
    });  
});

router.put("/:id", middlewareObj.checkSkatespotOwnership, (req, res) => {
   // find and update skatespot
   Skatespot.findByIdAndUpdate(req.params.id, req.body.skatespot, (err, updatedSkatespot) => {
       if(err){
           res.redirect("/skatespots");
       } else {
           res.redirect("/skatespots/" + req.params.id);
       }
   });
});

// DESTROY skatespot
router.delete("/:id", middlewareObj.checkSkatespotOwnership, (req, res) => {
    Skatespot.findByIdAndDelete(req.params.id, (err) => {
        if(err) {
            res.redirect("/skatespots");
        } else {
            res.redirect("/skatespots");
        }
    });
});

module.exports = router;