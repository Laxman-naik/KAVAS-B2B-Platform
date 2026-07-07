const cloudinary = require("./cloudinary");

const uploadToCloudinary = async (
  filePath,
  folder,
  resourceType = "auto"
) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

module.exports = uploadToCloudinary;