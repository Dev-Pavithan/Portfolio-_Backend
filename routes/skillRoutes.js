const express = require('express');
const {
  getSkills,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../controllers/skillController.js');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getSkills);

// Admin protected routes
router.post('/categories', protect, authorize('admin'), createCategory);
router.put('/categories/:categoryId', protect, authorize('admin'), updateCategory);
router.delete('/categories/:categoryId', protect, authorize('admin'), deleteCategory);

router.post('/categories/:categoryId/subcategories', protect, authorize('admin'), createSubcategory);
router.put('/categories/:categoryId/subcategories/:subcategoryId', protect, authorize('admin'), updateSubcategory);
router.delete('/categories/:categoryId/subcategories/:subcategoryId', protect, authorize('admin'), deleteSubcategory);

module.exports = router;