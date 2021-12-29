const express = require('express'),
      router = express.Router({ mergeParams: true }),
      // middlewareObj = require('../middleware/index'),
      { skateSpotSchema } = require('../middleware/schemas'),
      catchAsync = require('../utils/catchAsync'),
      ExpressError = require('../utils/ExpressError'), 
      Skatespot = require('../models/skatespot');

// Skate spot validation
const validateSkatespot = (req, res, next) => {
    const { error } = skateSpotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 500)
    } else {
        next();
    }
};


//INDEX route without search and pagination
router.get('/', catchAsync(async (req, res) => {
    const skatespots = await Skatespot.find({});
    res.render('skatespots/index', { skatespots });
}));
    
 //NEW - show form to create new skatespot
router.get('/new', (req, res) => {
  res.render('skatespots/new');
});  
 
//CREATE Skatespot removed geolocation, auth middleware, image upload
router.post('/', validateSkatespot, catchAsync(async (req, res, next) => {  
    // Get data from form and add to skatespots 
    const skatespot = new Skatespot(req.body.skatespot);
    // Create a new skatespot and save to DB
    await skatespot.save();
    res.redirect(`/skatespots/${skatespot.id}`);
}));

//SHOW page
router.get('/:id', catchAsync(async(req, res) => {
  const skatespot = await Skatespot.findById(req.params.id);
  res.render('skatespots/show', { skatespot });

  // Skatespot.findById(req.params.id).populate('comments').exec((err, foundSkatespot) => {
  //     if (err) {
  //       console.log(err);
  //       req.flash('error', "Skate Spot doesn't exist!");
  //       res.redirect('back');
  //     } else {
        
  //       res.render('skatespots/show', { skatespot: foundSkatespot });
  //     }
  //   });
}));

// EDIT: SkateSpots removed auth middleware
router.get('/:id/edit', (req, res) => {
    Skatespot.findById(req.params.id, (err, foundSkatespot) => {
      if (err) {
        res.redirect('/skatespots');
      } else {
        res.render('skatespots/edit', { skatespot: foundSkatespot });
      }
    });
  }
);

//EDIT:Put removed geolocation, auth middleware, image upload
router.put('/:id', validateSkatespot, catchAsync(async (req, res) => {
  
      let skatespot = await Skatespot.findByIdAndUpdate(req.params.id, req.body.skatespot,{ new: true });     

      await skatespot.save();
      req.flash('success', 'Skate Spot successfully updated!');
      res.redirect('/skatespots/' + req.params.id);
  }
)); 

// DESTROY skatespot
router.delete('/:id', (req, res) => {
    Skatespot.findById(req.params.id, catchAsync(async (err, skatespot) => {
        
        await skatespot.remove();
        req.flash('success', 'Skate Spot deleted successfully!');
        res.redirect('/skatespots');
    }));
  });


module.exports = router;
