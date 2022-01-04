const cloudinary = require('cloudinary').v2,
      { CloudinaryStorage } = require('multer-storage-cloudinary');
      //  multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skateSpots',
    public_id: (req, file) => file.filename,
    allowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
    format: async () => "jpg",
    transformation: [{ width: 500, crop: 'fit' }]
    // format: async (req, file) => 'png', // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

// const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  storage
}