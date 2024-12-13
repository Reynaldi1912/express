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
    const query = `SELECT u.id as user_id,
                        u.username,
                        u.role,
                        u.token_app AS token_user,
                        au.start_date,
                        au.expired_at,
                        COUNT(e.id) AS total_exam,
                        au.limit_exam,
                        COUNT(child.id) AS total_user,
                        au.limit_user,
                        CASE WHEN u.token_app = au.token THEN 1 ELSE 0 END AS token_status,
                                CASE WHEN CURRENT_DATE <= au.expired_at AND CURRENT_DATE >= au.start_date THEN 1 ELSE 0 END AS status_aktif
                FROM access_user as au 
                LEFT JOIN users as u ON au.user_id = u.id
                LEFT JOIN exams AS e ON u.id = e.user_id
                LEFT JOIN users AS child ON u.id = child.parent_id
                WHERE u.id = ?
                GROUP BY au.id , au.start_date , u.id, e.user_id`; 

    db.query(query , [id], (err, results) => {
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
