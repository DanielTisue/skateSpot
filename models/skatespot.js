const mongoose = require('mongoose'),
      Comment = require('./comment'),
      Schema = mongoose.Schema;

const skatespotSchema = new Schema({
  name: String,
  image: String,
  description: String,
  location: String,
  price: Number,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Skatespot', skatespotSchema);
