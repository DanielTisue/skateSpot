const  Skatespot =   require("../models/skatespot"),
       Comment =     require("../models/comment");

module.exports.createComment = async (req, res) => {
   //look up skatespot using id
   const skatespot = await Skatespot.findById(req.params.id);
   //create a new comment 
   const comment = new Comment(req.body.comment);
   //add author with ref to user._id
   comment.author = req.user._id;
   //push single comment to comments array in skatespot schema
   skatespot.comments.push(comment);
   //save comment
   await comment.save();
   //save skatespot
   await skatespot.save();
   req.flash('success', 'Your comment was successfully added!')
   res.redirect(`/skatespots/${skatespot._id}`);
    
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Skatespot.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Your comment was successfully deleted!');
    res.redirect(`/skatespots/${id}`);     
}