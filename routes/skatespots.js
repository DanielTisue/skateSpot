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
  Skatespot.find({}, (err, allSkatespots) => {
    if (err) {
      console.log(err);
    } else {
      res.render("skatespots/index", {
        skatespots: allSkatespots,
        page: "skatespots",
        currentUser: req.user
      });
    }
  });
});

//CREATE Skatespot
router.post(
  "/",
  middlewareObj.isLoggedIn,
  upload.single("image"),
  (req, res) => {
    req.body.image = {
      url: req.file.secure_url,
      public_id: req.file.public_id
    };
    // get data from form and add to skatespots array
    const name = req.body.name,
          image = req.body.image,
          desc = req.body.description,
          author = {
                id: req.user._id,
                username: req.user.username
          }
  geocoder.geocode(req.body.location, (err,data) => {
      if ( err || !data.length) {
        req.flash('error', 'Invalid Adress');
        return res.redirect('back');
      }
      const lat = data[0].latitude,
            lng = data[0].longitude,
            location = data[0].formattedAddress;
      const newSkatespot = {
          name: name,
          image: image,
          description: desc,
          author: author,
          location: location,
          lat: lat,
          lng: lng
      };
    // Create a new skatespot and save to DB
    Skatespot.create(newSkatespot, (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        console.log(newlyCreated);
        //redirect back to skatespots page
        res.redirect("/skateSpots/" + newlyCreated.id);
      }
    });
  });
});

//NEW - show form to create new skatespot
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
  res.render("skatespots/new");
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
  "/:id", middlewareObj.isLoggedIn, middlewareObj.checkSkatespotOwnership, upload.single("image"), (req, res) => {
    // find and update skatespot
    Skatespot.findByIdAndUpdate(req.params.id, req.body.skatespot, async(err, skatespot) => {
        if (err) {
          console.log(err);
          req.flash("error", "UH OH...Something went wrong! This SkateSpot doesn't exist");
          res.redirect("/skatespots");
        } else {
          
          geocoder.geocode(req.body.location, async(err, data) => {
            if (err || !data.length) {
              console.log(err);
              req.flash('error', 'Invalid Address');
              return res.redirect('back');
            }
            
            skatespot.lat = req.body.skatespot.location.lat.data[0].latitude;
            skatespot.lng = req.body.skatespot.location.lng.data[0].longitude;
            skatespot.location = req.body.skatespot.location.data[0].formattedAddress;
          if (req.file) {
            try {
              await cloudinary.v2.uploader.destroy(skatespot.image.public_id);
              skatespot.image.public_id = req.file.public_id;
              skatespot.image.url = req.file.secure_url;
              //await skatespot.save();
            } catch (err) {
              return res.redirect("back");
            }
          }
            skatespot.name = req.body.skatespot.name;
            skatespot.description = req.body.skatespot.description;
            skatespot.save();
        req.flash("success", "Skate Spot successfully updated!");
        res.redirect("/skatespots/" + req.params.id);
      });
    }
  });
}); 

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
