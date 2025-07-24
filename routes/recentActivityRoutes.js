// routes/recentActivityRoutes.js
const express = require('express');
const { getRecentActivity } = require('../controllers/recentActivityController.js');
const router = express.Router();

router.get('/', getRecentActivity);

module.exports = router;
