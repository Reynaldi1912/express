const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// Lindungi rute dengan middleware autentikasi
router.get('/get-dashboard', authenticateToken, examController.getDashboard);
router.get('/exams', authenticateToken, examController.getExams);
router.post('/updateToken' ,authenticateToken, authController.updateToken);

router.get('/users', userController.getDataUser);
router.post('/login', authController.login_POST);

module.exports = router;
