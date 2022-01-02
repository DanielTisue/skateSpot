const express =     require("express"),
      router =      express.Router({mergeParams: true}),
      { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware/index'),
      comments = require('../controllers/comments'),
      catchAsync = require('../utils/catchAsync');
      
      

// '/skatespots/:id/comments'
// Comments Create
router.post('/', validateComment, isLoggedIn, catchAsync(comments.createComment));

// DELETE
router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));


module.exports = router;