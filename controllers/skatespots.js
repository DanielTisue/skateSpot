const Skatespot = require('../models/skatespot'),
      mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'),
      { cloudinary } = require('../cloudinary');

const mapBoxToken = process.env.MAPBOX_TOKEN,
      geocoder = mbxGeocoding({ accessToken: mapBoxToken });

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports.index = async (req, res) => {
let noMatch = null;

  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Skatespot.find({$or:[{name: regex}, {location: regex}]}).exec((err, allSkatespots) => {
      Skatespot.count({
        $or: [{ name: regex }, { location: regex }]
      }).exec((err, count) => {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          if (allSkatespots.length < 1) {
            noMatch =
              "No skate spots match that, please enter another search.";
          }
          res.render("skatespots/index", {
            skatespots: allSkatespots,
            noMatch: noMatch,
            search: req.query.search
          });
        }
      });
    });
  } else {
    Skatespot.find({}).exec((err, allSkatespots) => {
        Skatespot.count().exec((err, count) => {
          if (err) {
            console.log(err);
            res.redirect("back");
          } else {
            res.render("skatespots/index", {
              skatespots: allSkatespots,
              noMatch: noMatch,
              search: false
            });
          }
        });
      });
  }
}

module.exports.renderNewForm = (req, res) => {
  res.render('skatespots/new');
}

module.exports.createSkatespot = async (req, res, next) => {  
    const geoData = await geocoder.forwardGeocode({
      query: req.body.skatespot.location,
      limit: 1
    }).send()
    // Get data from form and add to skatespots 
    const skatespot = new Skatespot(req.body.skatespot);
    skatespot.geometry = geoData.body.features[0].geometry;
    skatespot.images = req.files.map(f => ({url: f.path, filename: f.filename }));
    //adding author to skate spot
    skatespot.author = req.user._id;
    // Create a new skatespot and save to DB
    await skatespot.save();
    req.flash('success', 'Your skate spot was successfully created!');
    res.redirect(`/skatespots/${skatespot.id}`);
}

module.exports.showSkatespot = async(req, res) => {
  const skatespot = await Skatespot.findById(req.params.id).populate({path:'comments', populate: {path: 'author'}}).populate('author');
  if (!skatespot) {
        req.flash('error', 'That skate spot no longer exists!');
        return res.redirect('/skatespots');
    }
  res.render('skatespots/show', { skatespot });
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const skatespot = await Skatespot.findById(id);
      if (!skatespot) {
          req.flash('error', 'That skate spot no longer exists. There is nothing to edit!');
          return res.redirect('/skatespots');
      }
  res.render('skatespots/edit', { skatespot });
  }

  module.exports.updateSkatespot = async (req, res) => {
    const { id } = req.params;
    const skatespot = await Skatespot.findByIdAndUpdate(id, { ...req.body.skatespot });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }));
    skatespot.images.push(...imgs);
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
        }
        await skatespot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await skatespot.save();
    req.flash('success', 'Your skate spot was successfully updated!');
    res.redirect(`/skatespots/${id}`);
  }

  module.exports.deleteSkatespot = async (req, res) => {
    const { id } = req.params;
    await  Skatespot.findByIdAndDelete(id);    
    req.flash('success', 'Your skate spot was successfully deleted!');
    res.redirect('/skatespots');
  }