const express = require('express');
const {
  addProject,
  getProject,
  getAllProjects,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.single('image'), addProject);
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
