const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// Lindungi rute dengan middleware autentikasi
router.get('/get-dashboard', authenticateToken, examController.getDashboard);
router.get('/exams', examController.getExams);
router.get('/groupings', examController.getGrouping);
router.get('/users-exam', examController.getUsers);
router.get('/getTokenUser' , authController.getTokenUser);
router.get('/getTokenApp' , authController.getTokenApp);
router.get('/users', userController.getDataUser);
router.post('/login', authController.login_POST);
router.post('/updateToken' , authController.updateToken);

module.exports = router;
