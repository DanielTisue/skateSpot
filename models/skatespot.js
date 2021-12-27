const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skatespotSchema = new Schema({
  name: String,
  image: {
    url: String,
    public_id: String
  },
  description: String,
  location: String,
  price: Number,
  // lat: Number,
  // lng: Number,
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Skatespot', skatespotSchema);
