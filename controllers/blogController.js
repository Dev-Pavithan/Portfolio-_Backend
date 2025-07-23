const Blog = require('../models/Blog');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const cloudinary = require('../config/cloudinary');

// @desc    Add new blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
exports.addBlog = asyncHandler(async (req, res, next) => {
  const { title, link, date, source_name, excerpt } = req.body;

  if (!req.file) {
    return next(new ErrorResponse('Please upload an image for the blog', 400));
  }

  // Upload image to Cloudinary
  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'blog_images' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  const blog = await Blog.create({
    title,
    link,
    date,
    source_name,
    excerpt,
    image: uploaded.secure_url
  });

  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Get single blog
// @route   GET /api/v1/blogs/:id
// @access  Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse('Blog not found', 404));
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find().sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});


// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorResponse('Blog not found', 404));
  }

  const { title, link, date, source_name, excerpt } = req.body;
  const updatedFields = { title, link, date, source_name, excerpt };

  // If new image is uploaded, upload to Cloudinary
  if (req.file) {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'blog_images' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    updatedFields.image = uploaded.secure_url;
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorResponse('Blog not found', 404));
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully'
  });
});
