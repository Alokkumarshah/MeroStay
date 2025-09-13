const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'MeroStay_DEV',
    allowerdFormats: ["png","jpg","jpeg","HEIF"], // supports promises as well
   
  },
});

module.exports={
    cloudinary,
    storage,
}