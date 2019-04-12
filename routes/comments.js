const express = require("express");
const router = express.Router({mergeParams: true});
const Skatespot = require("../models/skatespot");
const Comment = require("../models/comment");
//var middleware = require("../middleware");
//ad changes
//Comments New
router.get("/new", function(req, res){
    Skatespot.findById(req.params.id, function(err, skatespot){
        if(err){
            console.log(err);
        } else {
           res.render("comments/new", {skatespot: skatespot}); 
        }
    });
});

//Comments Create
router.post("/", function(req, res){
    //look up skatespot using id
   Skatespot.findById(req.params.id, function(err, skatespot){
        if(err){
            console.log(err);
            res.redirect("/skateSpots");
        } else {
            Comment.create( req.body.comment, function(err, comment){
                if(err){
                    //req.flash("error", "Something went wrong");
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
                    //req.flash("success", "Successfully Added Comment!");
                    res.redirect('/skateSpots/' + skatespot._id);
                }
            });
        }
    });
});

//EDIT route--skateSpots/:id/comments:comment_id/edit
router.get("/:comment_id/edit", function(req, res){
    Skatespot.findById(req.params.id, function(err, foundSkatespot){
            if(err || !foundSkatespot){
                //req.flash("error", "Skatespot not found!");
                return res.redirect("back");
            }
            Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {skatespot_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//UPDATE route
router.put("/:comment_id", function(req, res){
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

//DELETE (DESTROY) route
router.delete("/:comment_id",function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){ 
          res.redirect("back");
      } else {
          //req.flash("success", "Comment Deleted!");
          res.redirect("/skateSpots/" + req.params.id);
      }
    });
});



module.exports = router;