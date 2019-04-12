const express = require("express");
const router = express.Router({mergeParams: true});
const Skatespot = require("../models/skatespot");
//      Comment = require("../models/comment");

//INDEX
router.get('/', (req,res) => {
    Skatespot.find({}, (err, allSkatespots) => {
    if(err){
        console.log(err);
    } else {
        res.render('skatespots/index', {skatespots: allSkatespots});
    }
  });
});

//CREATE Skatespot
router.post("/", (req, res) => {
    // get data from form and add to skatespots array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newSkatespot = {name: name, image: image, description: desc, author: author};
    
    // Create a new skatespot and save to DB
    Skatespot.create(newSkatespot, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to skatespots page
            res.redirect("skatespots");
        }
    });
});

//NEW - show form to create new skatespot
router.get("/new", (req, res) => {
   res.render("skatespots/new"); 
});

//SHOW page
router.get("/:id", (req, res) => {
    //find the skatespot with provided ID
    // Skatespot.findById(req.params.id, function(err, foundSkatespot){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.render("show", {skatespot: foundSkatespot});
    //     }
    // });
    
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


module.exports = router;