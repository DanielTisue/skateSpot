const express = require('express'),
      router = express.Router({ mergeParams: true }),
      catchAsync = require('../utils/catchAsync'),
      { isLoggedIn, validateSkatespot, isAuthor } = require('../middleware/index'), 
      Skatespot = require('../models/skatespot');
     

//INDEX 
router.get('/', catchAsync(async (req, res) => {
    const skatespots = await Skatespot.find({});
    res.render('skatespots/index', { skatespots });
}));
    
//NEW form
router.get('/new', isLoggedIn, (req, res) => {
  res.render('skatespots/new');
});  
 
//CREATE
router.post('/', isLoggedIn, validateSkatespot, catchAsync(async (req, res, next) => {  
    // Get data from form and add to skatespots 
    const skatespot = new Skatespot(req.body.skatespot);
    //adding author to skate spot
    skatespot.author = req.user._id;
    // Create a new skatespot and save to DB
    await skatespot.save();
    req.flash('success', 'Your skate spot was successfully created!');
    res.redirect(`/skatespots/${skatespot.id}`);
}));

//SHOW page
router.get('/:id', catchAsync(async(req, res) => {
  const skatespot = await Skatespot.findById(req.params.id).populate({path:'comments', populate: {path: 'author'}}).populate('author');
  if (!skatespot) {
        req.flash('error', 'That skate spot no longer exists!');
        return res.redirect('/skatespots');
    }
  res.render('skatespots/show', { skatespot });
}));

// EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const skatespot = await Skatespot.findById(id);
      if (!skatespot) {
          req.flash('error', 'That skate spot no longer exists. There is nothing to edit!');
          return res.redirect('/skatespots');
      }
  res.render('skatespots/edit', { skatespot });
  }));

//UPDATE
router.put('/:id', isLoggedIn, isAuthor, validateSkatespot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Skatespot.findByIdAndUpdate(id, { ...req.body.skatespot });
    req.flash('success', 'Your skate spot was successfully updated!');
    res.redirect(`/skatespots/${id}`);
  }
)); 

//DESTROY 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await  Skatespot.findByIdAndDelete(id);    
  req.flash('success', 'Your skate spot was successfully deleted!');
  res.redirect('/skatespots');
  }));


module.exports = router;
