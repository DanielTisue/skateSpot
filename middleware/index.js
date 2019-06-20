const Skatespot =   require("../models/skatespot"),
      Comment =     require("../models/comment");

// all the middlware goes here
const middlewareObj = {};

middlewareObj.checkSkatespotOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Skatespot.findById(req.params.id, function(err, foundSkatespot){
           if(err){
               //req.flash("error", "Skate Spot not found");
               res.redirect("back");
           }  else {
               // does user own the the skatespot? 
            if(foundSkatespot.author.id.equals(req.user._id)) {
                next();
            } else {
                //req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        //req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                //req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        //req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;