const express = require('express'),
      router = express.Router({ mergeParams: true }),
      skatespots = require('../controllers/skatespots'),
      catchAsync = require('../utils/catchAsync'),
      { isLoggedIn, validateSkatespot, isAuthor } = require('../middleware/index'),
      multer = require('multer'),
      { storage } = require('../cloudinary');
            
      // Skatespot = require('../models/skatespot');
     
const upload = multer({ storage });


//INDEX - CREATE
router.route('/')
      .get(catchAsync(skatespots.index))
      .post(isLoggedIn, upload.array('image'), validateSkatespot, catchAsync(skatespots.createSkatespot));
     


//NEW form
router.get('/new', isLoggedIn, skatespots.renderNewForm);

//SHOW, UPDATE, DELETE
router.route('/:id')
      .get(catchAsync(skatespots.showSkatespot))
      .put(isLoggedIn, isAuthor, upload.array('image'), validateSkatespot, catchAsync(skatespots.updateSkatespot))
      .delete(isLoggedIn, isAuthor, catchAsync(skatespots.deleteSkatespot));

// EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(skatespots.renderEditForm));

module.exports = router;
