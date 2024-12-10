const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

// Lindungi rute dengan middleware autentikasi
router.get('/get-dashboard', authenticateToken, examController.getDashboard);
router.get('/exams', authenticateToken, examController.getExams);

router.post('/login', authController.login_POST);

module.exports = router;
