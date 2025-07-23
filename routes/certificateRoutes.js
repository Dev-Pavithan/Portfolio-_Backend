const express = require('express');
const {
  addCertificate,
  getCertificate,
  getAllCertificates,
  updateCertificate,
  deleteCertificate
} = require('../controllers/certificateController.js');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.single('image'), addCertificate);
router.get('/', getAllCertificates);
router.get('/:id', getCertificate);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCertificate);
router.delete('/:id', protect, authorize('admin'), deleteCertificate);

module.exports = router;
