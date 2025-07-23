const express = require('express');
const { addWorkExperience, getAllWorkExperiences, getWorkExperience, updateWorkExperience, deleteWorkExperience } = require('../controllers/workExperienceController.js');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, authorize('admin'), addWorkExperience);
router.get('/', getAllWorkExperiences);
router.get('/:id', getWorkExperience);
router.put('/:id', protect, authorize('admin'), updateWorkExperience);
router.delete('/:id', protect, authorize('admin'), deleteWorkExperience);

module.exports = router;
