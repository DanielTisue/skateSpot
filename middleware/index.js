const { skateSpotSchema, commentSchema } = require('./schemas'),
      ExpressError = require('../utils/ExpressError'),
      Skatespot =   require('../models/skatespot'),
      Comment =     require('../models/comment');
    

// all the middlware goes here

//Have to be logged in
const isLoggedIn = function(req, res, next){
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You need to be logged in to do that!');
        return res.redirect('/login');
    }
    next();
};

// Skate Spot validation
const validateSkatespot = (req, res, next) => {
    const { error } = skateSpotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 500)
    } else {
        next();
    }
};

//Skate Spot Author validation
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const skatespot = await Skatespot.findById(id);
  if (!skatespot.author.equals(req.user._id)) {
    req.flash('error', "You don't have the correct permissions: Either you are not the post owner, or you're not logged in.");
    return res.redirect(`/skatespots/${id}`);
  } else {
    next();
  } 
}

//Comment validation
const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(req.user._id)) {
    req.flash('error', "You don't have the correct permissions: Either you are not the post owner, or you're not logged in.");
    return res.redirect(`/skatespots/${id}`);
  } else {
    next();
  } 
}



module.exports = { isLoggedIn, validateSkatespot, isAuthor, validateComment, isCommentAuthor};