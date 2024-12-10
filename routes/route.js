const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authenticateToken = require('../middleware/auth');

// Lindungi rute dengan middleware autentikasi
router.get('/exams', authenticateToken, examController.getExams);

module.exports = router;
