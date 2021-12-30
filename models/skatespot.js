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

skatespotSchema.post('findOneAndDelete', async function(doc) {
  if(doc) {
    await Comment.deleteMany({ _id: { $in: doc.comments } });
  }
});

module.exports = mongoose.model('Skatespot', skatespotSchema);
