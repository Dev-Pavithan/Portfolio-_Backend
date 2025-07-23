const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return cb(new Error('Only .jpg, .jpeg, .png images are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
