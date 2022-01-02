const Skatespot = require('../models/skatespot');

module.exports.index = async (req, res) => {
    const skatespots = await Skatespot.find({});
    res.render('skatespots/index', { skatespots });
}

module.exports.renderNewForm = (req, res) => {
  res.render('skatespots/new');
}

module.exports.createSkatespot = async (req, res, next) => {  
    // Get data from form and add to skatespots 
    const skatespot = new Skatespot(req.body.skatespot);
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
    const spot = await Skatespot.findByIdAndUpdate(id, { ...req.body.skatespot });
    req.flash('success', 'Your skate spot was successfully updated!');
    res.redirect(`/skatespots/${id}`);
  }

  module.exports.deleteSkatespot = async (req, res) => {
  const { id } = req.params;
  await  Skatespot.findByIdAndDelete(id);    
  req.flash('success', 'Your skate spot was successfully deleted!');
  res.redirect('/skatespots');
  }