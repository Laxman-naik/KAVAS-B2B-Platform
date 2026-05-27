// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,

//   params: async (req, file) => ({
//     folder: "products",

//     allowed_formats: ["jpg", "jpeg", "png", "webp"],

//     public_id:
//       Date.now() +
//       "-" +
//       file.originalname.split(".")[0],
//   }),
// });

// const upload = multer({
//   storage,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: "products",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo
        ? ["mp4", "mov", "webm"]
        : ["jpg", "jpeg", "png", "webp"],

      public_id:
        Date.now() +
        "-" +
        file.originalname.split(".")[0],
    };
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = upload;