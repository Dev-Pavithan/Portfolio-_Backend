const Certificate = require('../models/Certificate.js');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../config/cloudinary');

// @desc    Add new certificate
// @route   POST /api/v1/certificates
// @access  Private/Admin
exports.addCertificate = asyncHandler(async (req, res, next) => {
  const { title, issuedBy, issuedDate } = req.body;

  if (!req.file) {
    return next(new ErrorResponse('Please upload a certificate image', 400));
  }

  // Upload image to Cloudinary
  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'certificates' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  const certificate = await Certificate.create({
    title,
    issuedBy,
    issuedDate,
    image: uploaded.secure_url
  });

  res.status(201).json({
    success: true,
    data: certificate
  });
});

// @desc    Get single certificate
// @route   GET /api/v1/certificates/:id
// @access  Public
exports.getCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return next(new ErrorResponse('Certificate not found', 404));

  res.status(200).json({ success: true, data: certificate });
});

// @desc    Get all certificates
// @route   GET /api/v1/certificates
// @access  Public
exports.getAllCertificates = asyncHandler(async (req, res, next) => {
  const certificates = await Certificate.find().sort({ issuedDate: -1 });
  res.status(200).json({ success: true, data: certificates });
});

// @desc    Update certificate
// @route   PUT /api/v1/certificates/:id
// @access  Private/Admin
exports.updateCertificate = asyncHandler(async (req, res, next) => {
  let certificate = await Certificate.findById(req.params.id);
  if (!certificate) return next(new ErrorResponse('Certificate not found', 404));

  const { title, issuedBy, issuedDate } = req.body;
  const updatedFields = { title, issuedBy, issuedDate };

  if (req.file) {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'certificates' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    updatedFields.image = uploaded.secure_url;
  }

  certificate = await Certificate.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: certificate });
});

// @desc    Delete certificate
// @route   DELETE /api/v1/certificates/:id
// @access  Private/Admin
exports.deleteCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return next(new ErrorResponse('Certificate not found', 404));

  await certificate.deleteOne();
  res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
});
