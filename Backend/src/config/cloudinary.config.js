const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('./config');

cloudinary.config(config.cloudinary);

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpeg', 'png', 'jpg'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

module.exports = {
  storage
};
