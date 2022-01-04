const express = require('express'),
      router = express.Router({ mergeParams: true }),
      skatespots = require('../controllers/skatespots'),
      catchAsync = require('../utils/catchAsync'),
      { isLoggedIn, validateSkatespot, isAuthor } = require('../middleware/index');

      const multer = require('multer'),
            upload = multer({dest: 'uploads/'});
      // Skatespot = require('../models/skatespot');
     

//INDEX - CREATE
router.route('/')
      .get(catchAsync(skatespots.index))
      .post(isLoggedIn, validateSkatespot, catchAsync(skatespots.createSkatespot));
      


//NEW form
router.get('/new', isLoggedIn, skatespots.renderNewForm);

//SHOW, UPDATE, DELETE
router.route('/:id')
      .get(catchAsync(skatespots.showSkatespot))
      .put(isLoggedIn, isAuthor, validateSkatespot, catchAsync(skatespots.updateSkatespot))
      .delete(isLoggedIn, isAuthor, catchAsync(skatespots.deleteSkatespot));

// EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(skatespots.renderEditForm));

module.exports = router;
