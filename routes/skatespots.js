const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Skatespot = require('../models/skatespot'),
  middlewareObj = require('../middleware/index'),
  NodeGeocoder = require('node-geocoder'),
  catchAsync = require('../utils/catchAsync');


// Geocoder config
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
}

const geocoder = NodeGeocoder(options);

// Multer setup/ config
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
  folder: "skateSpots",
  public_id: (req, file) => file.filename,
  allowedFormats: ["jpeg", "jpg", "png"],
  format: async () => "jpg",
  transformation: [{ width: 500, crop: 'fit'}]
}
});
const upload = multer({ storage: storage });

// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// };

//INDEX with search query and pagination
// router.get("/", (req, res) => {
//   let perPage = 4,
//         pageQuery = parseInt(req.query.page),
//         pageNumber = pageQuery ? pageQuery : 1,
//         noMatch = null;
  
//   if(req.query.search) {
//     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//     Skatespot.find({$or:[{name: regex}, {location: regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allSkatespots) => {
//       Skatespot.count({$or: [{ name: regex }, { location: regex }]}).exec((err, count) => {
//         if (err) {
//           console.log(err);
//           res.redirect('back');
//         } else {
//           if (allSkatespots.length < 1) {
//             noMatch = 'No skate spots match that, please enter another search.';
//           }
//           res.render('skatespots/index', {
//             skatespots: allSkatespots,
//             current: 'pageNumber',
//             pages: Math.ceil(count / perPage),
//             noMatch: noMatch,
//             search: req.query.search
//           });
//         }
//       });
//     });
//   } else {
//     Skatespot.find({}).skip(perPage * pageNumber - perPage).limit(perPage).exec((err, allSkatespots) => {
//         Skatespot.count().exec((err, count) => {
//           if (err) {
//             console.log(err);
//             // res.redirect("back");
//           } else {
//             res.render('skatespots/index', {
//               skatespots: allSkatespots,
//               current: 'pageNumber',
//               pages: Math.ceil(count / perPage),
//               noMatch: noMatch,
//               search: false
//             });
//           }
//         });
//       });
//   }
// });

//INDEX test route without search and pagination
router.get('/', catchAsync(async (req, res) => {
    const skatespots = await Skatespot.find({});
    res.render('skatespots/index', { skatespots });
}));
    
 //NEW - show form to create new skatespot
router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
  res.render('skatespots/new');
});  
 

//CREATE Skatespot original with geolocation from google and cloudinary image upload, and auth middleware
// router.post("/", middlewareObj.isLoggedIn, upload.single('image'), async (req, res) => {
//     try {
//       if ( req.file) {
//         req.body.image = {
//             url: req.file.secure_url,
//             public_id: req.file.filename
//           };
//         }
//         // get data from form and add to skatespots array
//         const data = await geocoder.geocode(req.body.location);
//         const lat = data[0].latitude,
//               lng = data[0].longitude,
//               location = data[0].formattedAddress;
//         const name = req.body.name,
//               image = req.body.image,
//               description = req.body.description,
//       author = {
//         id: req.user._id,
//         username: req.user.username
//       };
//         const newSkatespot = {
//             name,
//             image,
//             description,
//             author,
//             location,
//             lat,
//             lng
//           };
//     // Create a new skatespot and save to DB
//     const newlyCreated = await Skatespot.create(newSkatespot);
//     res.redirect("/skatespots/" + newlyCreated.id);
//   } catch(err) {
//     req.flash("error", err.message);
//     res.redirect("/skatespots/new");
//   }
// });

//CREATE Skatespot removed geolocation
router.post("/", middlewareObj.isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
    // try {
      if ( req.file) {
        req.body.image = {
            url: req.file.secure_url,
            public_id: req.file.filename
          };
        }
        // get data from form and add to skatespots array
        const location = req.body.location;
        const name = req.body.name,
              image = req.body.image,
              description = req.body.description,
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
            lat,
            lng
          };
    // Create a new skatespot and save to DB
    const newlyCreated = await Skatespot.create(newSkatespot);
    res.redirect('/skatespots/' + newlyCreated.id);
  // } catch(err) {
  //   req.flash("error", err.message);
  //   res.redirect("/skatespots/new");
  // }
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

// EDIT: SkateSpots
router.get('/:id/edit',middlewareObj.isLoggedIn,middlewareObj.checkSkatespotOwnership,(req, res) => {
    Skatespot.findById(req.params.id, (err, foundSkatespot) => {
      if (err) {
        res.redirect('/skatespots');
      } else {
        res.render('skatespots/edit', { skatespot: foundSkatespot });
      }
    });
  }
);

router.put('/:id', middlewareObj.isLoggedIn, middlewareObj.checkSkatespotOwnership, upload.single('image'), async (req, res) => {
    try {
      // find and update skatespot
      let skatespot = await Skatespot.findByIdAndUpdate(req.params.id, req.body.skatespot,{ new: true });
      if (skatespot.location !== req.body.location) {
        let newLocation = await geocoder.geocode(req.body.location);
        skatespot.lat = newLocation[0].latitude;
        skatespot.lng = newLocation[0].longitude;
        skatespot.location = newLocation[0].formattedAddress;
      }
      if (req.file) {
        await cloudinary.uploader.destroy(skatespot.image.public_id);
        skatespot.image.public_id = req.file.filename;
        skatespot.image.url = req.file.secure_url;
      }
      await skatespot.save();
      req.flash('success', 'Skate Spot successfully updated!');
      res.redirect('/skatespots/' + req.params.id);
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
  }
); 

// DESTROY skatespot
router.delete('/:id', middlewareObj.isLoggedIn, middlewareObj.checkSkatespotOwnership, (req, res) => {
    Skatespot.findById(req.params.id, async (err, skatespot) => {
      if (err) {
        req.flash('error', 'UH OH...Something went wrong!');
        res.redirect('/skatespots');
      } else {
        await cloudinary.uploader.destroy(skatespot.image.public_id);
        await skatespot.remove();
        req.flash('success', 'Skate Spot deleted successfully!');
        res.redirect('/skatespots');
      }
    });
  });


module.exports = router;
