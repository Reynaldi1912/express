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
router.get('/bank-question', examController.getBankQuestion);
router.get('/users/exams-data', examController.getDataExamUser);

router.get('/question-user', examController.getQuestionUser);
router.get('/number-of-exam', examController.numberOfPage);

router.get('/getTokenUser' , authController.getTokenUser);
router.get('/getTokenApp' , authController.getTokenApp);
router.get('/users', userController.getDataUser);
router.get('/users-master', userController.getDataUserMaster);
router.post('/login', authController.login_POST);
router.post('/updateToken' , authController.updateToken);
router.post('/save-answer' , examController.answerQuestion);

module.exports = router;
