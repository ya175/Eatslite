const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

const catchAsync = require("./catchAsync");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
//signup
exports.uploadeImage = async (req, res, next) => {
  // console.log(req.files,im);
  if (!req.files) {
    console.log("no images");
    req.body.image = undefined;
    return next();
    // console.log('noimages');
  }
  // console.log(`files: ${req.files}`);
  // console.log(`files:${req.files}`);
  console.log(req);
  const ext = req.files.image.mimetype.split("/")[1];
  const imageName = `restaurant--${Date.now()}.${ext}`;
  // console.log(imageName);
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      resource_type: "auto",
      public_id: `${imageName}`,
    }
  );
  console.log(result);
  req.body.image = result.secure_url;
  next();
};
