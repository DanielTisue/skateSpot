const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Skatespot = require("../models/skatespot"),
  middlewareObj = require("../middleware/index");

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
      location = req.body.location,
      author = {
        id: req.user._id,
        username: req.user.username
      };
    const newSkatespot = {
      name: name,
      image: image,
      description: desc,
      location: location,
      author: author
    };
    // Create a new skatespot and save to DB
    Skatespot.create(newSkatespot, (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        //redirect back to skatespots page
        res.redirect("skatespots");
      }
    });
  }
);

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
      // if (!foundSkatespot) {
      //     return res.status(400).send("Item not found.")
      // }
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
  (req, res) => {
    // find and update skatespot
    Skatespot.findByIdAndUpdate(
      req.params.id,
      req.body.skatespot,
      (err, updatedSkatespot) => {
        if (err) {
          res.redirect("/skatespots");
        } else {
          res.redirect("/skatespots/" + req.params.id);
        }
      }
    );
  }
);

// DESTROY skatespot
router.delete(
  "/:id",
  middlewareObj.isLoggedIn,
  middlewareObj.checkSkatespotOwnership,
  (req, res) => {
    Skatespot.findByIdAndDelete(req.params.id, err => {
      if (err) {
        res.redirect("/skatespots");
      } else {
        res.redirect("/skatespots");
      }
    });
  }
);

module.exports = router;
