const { cloudinary } = require('../cloudinary');

const mongoose = require('mongoose'),
      Comment = require('./comment'),
      Schema = mongoose.Schema;

      // https://res.cloudinary.com/danieltisue/image/upload/v1641269692/skateSpots/uk3ndntebdgze6udpd0c.png

const ImageSchema = new Schema({
      url: String,
      filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_500');
});

const opts = { toJSON: { virtuals: true } };

const skatespotSchema = new Schema({
  name: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String, 
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  description: String,
  location: String,
  price: Number,
  author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ] 
}, opts);

skatespotSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/skatespots/${this._id}">${this.name}</a><strong>
            <p class="text-muted">${this.location}</p>`
});

skatespotSchema.post('findOneAndDelete', async function(doc) {
  if(doc) {
    await Comment.deleteMany({ _id: { $in: doc.comments } });
    for(let file of doc.images){
      await cloudinary.uploader.destroy(file.filename);
    }
  }
});

module.exports = mongoose.model('Skatespot', skatespotSchema);
