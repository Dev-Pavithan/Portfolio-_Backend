const express = require('express');
const {
  addBlog,
  getBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.single('image'), addBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlog);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

module.exports = router;
