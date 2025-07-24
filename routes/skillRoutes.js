const express = require('express');
const { addSkills, getSkills, updateSkills, deleteSkills } = require('../controllers/skillController.js');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, authorize('admin'), addSkills);
router.get('/', getSkills);
router.put('/:id', protect, authorize('admin'), updateSkills);
router.delete('/:id', protect, authorize('admin'), deleteSkills);

module.exports = router;
