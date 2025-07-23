const express = require('express');
const { addEducation, getAllEducation, getEducation, updateEducation, deleteEducation } = require('../controllers/educationController.js');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, authorize('admin'), addEducation);
router.get('/', getAllEducation);
router.get('/:id', getEducation);
router.put('/:id', protect, authorize('admin'), updateEducation);
router.delete('/:id', protect, authorize('admin'), deleteEducation);

module.exports = router;
