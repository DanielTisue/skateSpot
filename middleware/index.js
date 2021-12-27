const Skatespot =   require("../models/skatespot"),
      Comment =     require("../models/comment"),
    Joi = require('joi');

// all the middlware goes here
const middlewareObj = {};

middlewareObj.skatespotSchema = Joi.object({
    skatespot: Joi.object({
        title: Joi.string().required(),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

middlewareObj.checkSkatespotOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Skatespot.findById(req.params.id, function(err, foundSkatespot){

            if (err || !foundSkatespot) {
                console.log(err);
                req.flash('error', "Sorry, that skatespot does not exist!");
                res.redirect('/skateSpots');
            } else if (foundSkatespot.author.id.equals(req.user._id)) {
                req.skatespot = foundSkatespot;
                next();
            } else {
                req.flash('error', "You don't have permission to do that!");
                res.redirect('/skateSpots/' + req.params.id);
            }
        });
  } else {
     req.flash('error', "You don't have permission to do that! Login First!");
     return res.redirect('/login');
  }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){ //if user is logged in then
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                console.log(err);
                req.flash('error', "Sorry, that comment does not exist!");
                return res.redirect('/skateSpots');
            } else if (foundComment.author.id.equals(req.user._id)) {
                res.locals.comment = foundComment;
                next();
            } else {
                req.flash('error', "You don't have permission to do that!");
                return res.redirect('/skateSpots/' + req.params.id);
            }
        });
    } else {
        req.flash('error', "You don't have permission to do that! Login First!");
        return res.redirect('/login');
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;