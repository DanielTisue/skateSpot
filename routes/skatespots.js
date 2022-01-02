const express = require('express'),
      router = express.Router({ mergeParams: true }),
      skatespots = require('../controllers/skatespots'),
      catchAsync = require('../utils/catchAsync'),
      { isLoggedIn, validateSkatespot, isAuthor } = require('../middleware/index');
      // Skatespot = require('../models/skatespot');
     

//INDEX 
router.get('/', catchAsync(skatespots.index));
    
//NEW form
router.get('/new', isLoggedIn, skatespots.renderNewForm);  
 
//CREATE
router.post('/', isLoggedIn, validateSkatespot, catchAsync(skatespots.createSkatespot));

//SHOW page
router.get('/:id', catchAsync(skatespots.showSkatespot));

// EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(skatespots.renderEditForm));

//UPDATE
router.put('/:id', isLoggedIn, isAuthor, validateSkatespot, catchAsync(skatespots.updateSkatespot)); 

//DESTROY 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(skatespots.deleteSkatespot));


module.exports = router;
