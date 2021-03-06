const mongoose = require("mongoose");

const skatespotSchema = new mongoose.Schema({
  name: String,
  image: {
    url: String,
    public_id: String
  },
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Skatespot", skatespotSchema);
