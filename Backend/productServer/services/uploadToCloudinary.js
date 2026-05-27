const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    fs.unlinkSync(filePath); // cleanup temp file

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw err;
  }
};

module.exports = uploadToCloudinary;