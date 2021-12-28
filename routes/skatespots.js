const express = require('express'),
      router = express.Router({ mergeParams: true }),
      // middlewareObj = require('../middleware/index'),
      { skatespotSchema } = require('./schemas.js'),
      catchAsync = require('../utils/catchAsync'),
      ExpressError = require('../utils/ExpressError'), 
      Skatespot = require('../models/skatespot');

// Skate spot validation
const validateSkatespot = (req, res, next) => {
    const { error } = skatespotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 500)
    } else {
        next();
    }
};


//INDEX test route without search and pagination
router.get('/', catchAsync(async (req, res) => {
    const skatespots = await Skatespot.find({});
    res.render('skatespots/index', { skatespots });
}));
    
 //NEW - show form to create new skatespot
router.get('/new', (req, res) => {
  res.render('skatespots/new');
});  
 

//CREATE Skatespot removed geolocation, auth middleware, image upload
router.post('/', validateSkatespot, catchAsync(async (req, res) => {
    
        // get data from form and add to skatespots array
        const location = req.body.location;
        const name = req.body.name,
              image = req.body.image,
              description = req.body.description,
              price = req.body.price
      author = {
        id: req.user._id,
        username: req.user.username
      };
        const newSkatespot = {
            name,
            image,
            description,
            author,
            location,
            price
          };
    // Create a new skatespot and save to DB
    const newlyCreated = await Skatespot.create(newSkatespot);
    res.redirect('/skatespots/' + newlyCreated.id);
  
}));

//SHOW page
router.get('/:id', (req, res) => {
  Skatespot.findById(req.params.id).populate('comments').exec((err, foundSkatespot) => {
      if (err) {
        // console.log(err);
        req.flash('error', "Skate Spot doesn't exist!");
        res.redirect('back');
      } else {
        
        res.render('skatespots/show', { skatespot: foundSkatespot });
      }
    });
});

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
