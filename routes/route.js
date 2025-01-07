const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const masterController = require('../controllers/masterController');
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
router.post('/finish' , examController.finishExam);

router.post('/insert-user' , masterController.insertUser);
router.post('/update-user' , masterController.updateUser);
router.post('/delete-user' , masterController.deleteUser);

router.post('/delete-grouping' , masterController.deleteGrouping);
router.post('/update-grouping' , masterController.updateGrouping);
router.post('/insert-grouping' , masterController.insertGrouping);

module.exports = router;
