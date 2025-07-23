const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const cloudinary = require('../config/cloudinary');

// @desc    Add new project
// @route   POST /api/v1/projects
// @access  Private/Admin
exports.addProject = asyncHandler(async (req, res, next) => {
  const { title, description, source } = req.body;

  if (!req.file) {
    return next(new ErrorResponse('Please upload a project image', 400));
  }

  // Upload image to Cloudinary
  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'project_images' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  const project = await Project.create({
    title,
    description,
    source,
    image: uploaded.secure_url
  });

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getAllProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private/Admin
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  const { title, description, source } = req.body;
  const updatedFields = { title, description, source };

  // If a new image is uploaded, upload to Cloudinary
  if (req.file) {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'project_images' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    updatedFields.image = uploaded.secure_url;
  }

  project = await Project.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  });
});
