const express =     require("express"),
      router =      express.Router({mergeParams: true}),
      { commentSchema } = require('../middleware/schemas'),
      catchAsync = require('../utils/catchAsync'),
      ExpressError = require('../utils/ExpressError'),
      Skatespot =   require("../models/skatespot"),
      Comment =     require("../models/comment");
    //   middlewareObj =  require("../middleware/index");

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Comments New
// router.get('/new', (req, res) => {
//     Skatespot.findById(req.params.id, function(err, skatespot){
//         if(err){
//             console.log(err);
//         } else {
//            res.render('comments/new', {skatespot: skatespot}); 
//         }
//     });
// });

// /skatespots/:id/comments

// Comments Create
router.post('/', validateComment, catchAsync(async (req, res) => {
   //look up skatespot using id
   const skatespot = await Skatespot.findById(req.params.id);
   //create a new comment 
   const comment = new Comment(req.body.comment);
   //push single comment to comments array in skatespot schema
   skatespot.comments.push(comment);
   //save comment
   await comment.save();
   //save skatespot
   await skatespot.save();
   
   res.redirect(`/skatespots/${skatespot._id}`);
    
}));

// EDIT route--skateSpots/:id/comments:comment_id/edit
// router.get('/:comment_id/edit', (req, res) => {
//             Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 console.log(err);
//                 res.redirect('back');
//             } else {
//                 res.render('comments/edit', {skatespot_id: req.params.id, comment: foundComment});
//             }
//         });
//     });

// UPDATE route
// router.put('/:comment_id', (req, res) => {
//   //find and update
//     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
//         if(err){
//             res.redirect('back');
//         } else {
//             //redirect
//             res.redirect('/skateSpots/' + req.params.id);
//         }
//     });
// }); 

// DELETE
router.delete('/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Skatespot.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    // req.flash('success', 'Comment Deleted!');
    res.redirect(`/skatespots/${id}`);
      
}));


module.exports = router;