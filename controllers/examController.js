// controllers/examController.js
const db = require('../config/database'); 

const getExams = (req, res) => {
    const query = 'SELECT * FROM users'; 

    db.query(query, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data ujian:', err);
            return res.status(500).json({ error: 'Failed to fetch exams' });
        }

        res.json(results);
    });
};

const getDashboard = (req, res) => {
    const id = req.header('UserId');
    const query = "SELECT * FROM access_user where user_id = "+id; 

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                    message: 'Internal Server Error' , 
                    success : false}
            );
        }

        if (results.length > 0) {
            res.json(
                {
                    data : results[0] , 
                    success : true
                }
            );
        } else {
            res.json(
                { 
                    message: 'data not found' , 
                    success : false 
                }
            );
        }
    });
};

module.exports = { getExams , getDashboard };
