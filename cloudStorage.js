const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
}); 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Wanderlust_dev",
    allowedFormats : ["jpg", "png", "jpeg"],
    transformation: [
      { width: 500, height: 500, crop: "limit", quality: "auto" } // Example transformation for optimization
    ],
    public_id: (req, file) => {
      return file.filename;
    }
  },
 
});

module.exports = {
    cloudinary,
    storage,
};