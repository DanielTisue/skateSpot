const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Skatespot = require("../models/skatespot"),
  middlewareObj = require("../middleware/index"),
  NodeGeocoder = require("node-geocoder");
// Geocoder config
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
}

const geocoder = NodeGeocoder(options);

// Multer setup/ config
const crypto = require("crypto");
const multer = require("multer");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinaryStorage = require("multer-storage-cloudinary");
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "skateSpots",
  allowedFormats: ["jpeg", "jpg", "png"],
  filename: function(req, file, cb) {
    let buf = crypto.randomBytes(16);
    buf = buf.toString("hex");
    let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, "");
    uniqFileName += buf;
    cb(undefined, uniqFileName);
  }
});
const upload = multer({ storage });

//INDEX
router.get("/", (req, res) => {
  const perPage = 4,
        pageQuery = parseInt(req.query.page),
        pageNumber = pageQuery ? pageQuery : 1;
  Skatespot.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allSkatespots) => {
    if(err){
      console.log(err);
    }
    Skatespot.count().exec((err, count) => {
          if (err) {
          console.log(err);
        } else {
          res.render("skatespots/index", {
            skatespots: allSkatespots,
            current: "pageNumber",
            pages: Math.ceil(count/ perPage),
            currentUser: req.user
          });
        }
      });
    });
});
    
   
 

//CREATE Skatespot
router.post(
  "/",
  middlewareObj.isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      if ( req.file) {
        req.body.image = {
            url: req.file.secure_url,
            public_id: req.file.public_id
          };
        }
        // get data from form and add to skatespots array
        const data = await geocoder.geocode(req.body.location);
        const lat = data[0].latitude,
              lng = data[0].longitude,
              location = data[0].formattedAddress;
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
    res.redirect("/skateSpots/" + newlyCreated.id);
  } catch(err) {
    req.flash("error", err.message);
    res.redirect("/skateSpots/new");
  }
});

//SHOW page
router.get("/:id", (req, res) => {
  Skatespot.findById(req.params.id)
    .populate("comments")
    .exec((err, foundSkatespot) => {
      if (err) {
        // console.log(err);
        req.flash("error", "Skate Spot doesn't exist!");
        res.redirect("back");
      } else {
        // if (!foundSkatespot) {
        //     return res.status(400).send("Item not found.")
        // }
        res.render("skatespots/show", { skatespot: foundSkatespot });
      }
    });
});

// EDIT: SkateSpots
router.get(
  "/:id/edit",
  middlewareObj.isLoggedIn,
  middlewareObj.checkSkatespotOwnership,
  (req, res) => {
    Skatespot.findById(req.params.id, (err, foundSkatespot) => {
      if (err) {
        res.redirect("/skatespots");
      } else {
        res.render("skatespots/edit", { skatespot: foundSkatespot });
      }
    });
  }
);

router.put(
  "/:id",
  middlewareObj.isLoggedIn,
  middlewareObj.checkSkatespotOwnership,
  upload.single("image"),
  async (req, res) => {
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
        await cloudinary.v2.uploader.destroy(skatespot.image.public_id);
        skatespot.image.public_id = req.file.public_id;
        skatespot.image.url = req.file.secure_url;
      }
      await skatespot.save();
      req.flash("success", "Skate Spot successfully updated!");
      res.redirect("/skatespots/" + req.params.id);
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
  }
); 

// DESTROY skatespot
router.delete(
  "/:id",
  middlewareObj.isLoggedIn,
  middlewareObj.checkSkatespotOwnership,
  (req, res) => {
    Skatespot.findById(req.params.id, async (err, skatespot) => {
      if (err) {
        req.flash("error", "UH OH...Something went wrong!");
        res.redirect("/skatespots");
      } else {
        await cloudinary.v2.uploader.destroy(skatespot.image.public_id);
        await skatespot.remove();
        req.flash("success", "Skate Spot deleted successfully!");
        res.redirect("/skatespots");
      }
    });
  });

module.exports = router;
