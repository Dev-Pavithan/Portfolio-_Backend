const express = require('express');
const {
  addSkills,
  getSkills,
  updateSkills,
  deleteSkills,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  deleteSubcategory
} = require('../controllers/skillController.js');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Main skills
router
  .route('/')
  .post(protect, authorize('admin'), addSkills)
  .get(getSkills);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateSkills)
  .delete(protect, authorize('admin'), deleteSkills);

// Category operations
router.post('/:id/categories', protect, authorize('admin'), addCategory);
router.put('/:id/categories/:categoryId', protect, authorize('admin'), updateCategory);
router.delete('/:id/categories/:categoryId', protect, authorize('admin'), deleteCategory);

// Subcategory operations
router.post('/:id/categories/:categoryId/subcategories', protect, authorize('admin'), addSubcategory);
router.delete('/:id/categories/:categoryId/subcategories/:subcategoryIndex', protect, authorize('admin'), deleteSubcategory);

module.exports = router;
