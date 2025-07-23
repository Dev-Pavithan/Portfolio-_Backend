const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  let profileImage = '';

  // Upload profile image if provided
  if (req.file) {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_images' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    profileImage = uploaded.secure_url;
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    profileImage,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

// Send token in response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') options.secure = true;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt
      }
    });
};


// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Validate new password
  if (!req.body.newPassword || req.body.newPassword.length < 6) {
    return next(new ErrorResponse('New password must be at least 6 characters', 400));
  }

  // Set new password
  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});


// @desc      Update user profile (except password and profile image)
// @route     PUT /api/v1/auth/updateprofile
// @access    Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  // Fields that can be updated
  const updatableFields = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    locationUrl: req.body.locationUrl
  };

  // Remove undefined fields
  Object.keys(updatableFields).forEach(
    key => updatableFields[key] === undefined && delete updatableFields[key]
  );

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    updatableFields,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.updateProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a profile image', 400));
  }

  // Upload to Cloudinary
  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'profile_images' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: uploaded.secure_url },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: {
      profileImage: user.profileImage
    }
  });
});