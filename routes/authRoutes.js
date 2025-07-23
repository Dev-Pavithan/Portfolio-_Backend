const express = require('express');
const {
  register,
  login,
  getMe,
  updatePassword,
  updateProfile,
  updateProfileImage
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();
const upload = require('../middlewares/upload');

router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.put('/updateprofile', protect, updateProfile);
router.put('/updateprofileimage', protect, upload.single('profileImage'), updateProfileImage);

module.exports = router;