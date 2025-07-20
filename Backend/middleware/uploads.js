const multer = require("multer");
const path = require("path");
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        cb(null, `IMG-${Date.now()}${ext}`);
    },
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("File format not supported."), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSize },
});

const memoryUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSize },
});

const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'localheroes' },
    (error, result) => {
      if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });
      req.body.image = result.secure_url;
      next();
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

// ✅ Export multer instance properly
module.exports = { upload, memoryUpload, uploadToCloudinary };
