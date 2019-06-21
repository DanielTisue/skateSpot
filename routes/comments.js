const express =     require("express"),
      router =      express.Router({mergeParams: true}),
      Skatespot =   require("../models/skatespot"),
      Comment =     require("../models/comment"),
      middlewareObj =  require("../middleware/index");

// Comments New
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    Skatespot.findById(req.params.id, function(err, skatespot){
        if(err){
            console.log(err);
        } else {
           res.render("comments/new", {skatespot: skatespot}); 
        }
    });
});

// Comments Create
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
    //look up skatespot using id
   Skatespot.findById(req.params.id, (err, skatespot) => {
        if(err){
            console.log(err);
            res.redirect("/skateSpots");
        } else {
            Comment.create( req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Something went wrong! Try again.");
                    console.log(err);
                }  else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    //save comment
                    comment.save();
                    skatespot.comments.push(comment);
                    skatespot.save();
                    console.log(comment);
                    req.flash("success", "Successfully Added Comment!");
                    res.redirect('/skateSpots/' + skatespot._id);
                }
            });
        }
    });
});

// EDIT route--skateSpots/:id/comments:comment_id/edit
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res) => {
            Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                res.render("comments/edit", {skatespot_id: req.params.id, comment: foundComment});
            }
        });
    });

// UPDATE route
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
  //find and update
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            //redirect
            res.redirect("/skateSpots/" + req.params.id);
        }
    });
}); 

// DELETE (DESTROY) route
router.delete("/:comment_id", middlewareObj.isLoggedIn, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){ 
          res.redirect("back");
      } else {
          req.flash("success", "Comment Deleted!");
          res.redirect("/skateSpots/" + req.params.id);
      }
    });
});


module.exports = router;