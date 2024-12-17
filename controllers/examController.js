// controllers/examController.js
const db = require('../config/database'); 
const getExams = (req, res) => {
    const id = req.query.userId;

    const query = `SELECT 
                                e.name,
                                DATE(e.start_date) AS date,
                                DATE_FORMAT(e.start_date, '%H:%i:%s') AS start_date,  -- Format as HH:MM:SS
                                DATE_FORMAT(e.end_date, '%H:%i:%s') AS end_date,
                                e.user_id,
                                CHAR_LENGTH(e.grouping_list_ids) - CHAR_LENGTH(REPLACE(e.grouping_list_ids, ',', '')) + 1 AS grouping_count,
                                e.grouping_list_ids,
                                CHAR_LENGTH(e.except_user_ids) - CHAR_LENGTH(REPLACE(e.except_user_ids, ',', '')) + 1 AS except_users,
                                e.except_user_ids
                    FROM 
                        exams AS e
                    WHERE 
                        e.user_id = ?
                    GROUP BY 
                        e.id;
                    `; 

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Gagal mengambil data ujian:', err);
            return res.status(500).json({
                message: 'Error, internal server error ' + err,
                success: false
            });
        }

        if (results.length > 0) {
            console.log(results.datas);
            return res.json({
                data: results,
                message: 'Data has been loaded',
                success: true
            });
        } else {
            return res.status(404).json({
                message: 'No exams found for this user',
                success: false
            });
        }
    });
};

const getGrouping = (req, res) => {
    const id = req.query.userId;

    const query = `SELECT * FROM groupings WHERE user_id = ?`; 

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Gagal mengambil data grouping:', err);
            return res.status(500).json({
                message: 'Error, internal server error ' + err,
                success: false
            });
        }

        if (results) {
            return res.json({
                data: results,
                message: 'Data has been loaded',
                success: true
            });
        } else {
            return res.status(404).json({
                message: 'No grouping found for this user',
                success: false
            });
        }
    });
};

const getUsers = (req, res) => {
    const id = req.query.userId;

    const query = `SELECT u.* , g.name as grouping_name FROM users as u LEFT JOIN groupings AS g ON u.grouping_id = g.id
                    WHERE parent_id = ? AND role = 'user'`; 

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Gagal mengambil data users:', err);
            return res.status(500).json({
                message: 'Error, internal server error ' + err,
                success: false
            });
        }

        if (results) {
            return res.json({
                data: results,
                message: 'Data has been loaded',
                success: true
            });
        } else {
            return res.status(404).json({
                message: 'No users found for this user',
                success: false
            });
        }
    });
};

const getDashboard = (req, res) => {
    const id = req.header('UserId');
    const query = `SELECT u.id as user_id,
                        u.username,
                        u.role,
                        au.token AS token_app,
                        COALESCE(u.token_app , (SELECT token_app FROM users where id = u.parent_id)) AS token_user,
                        au.start_date,
                        au.expired_at,
                       (SELECT COUNT(*) FROM exams where user_id = 1) AS total_exam,
                        au.limit_exam,
                        (SELECT COUNT(*) FROM users where parent_id = 1) AS total_user,
                        au.limit_user,
                        CASE WHEN u.token_app = au.token THEN 1 ELSE 0 END AS token_status,
                        CASE WHEN CURRENT_DATE <= au.expired_at AND CURRENT_DATE >= au.start_date THEN 1 ELSE 0 END AS status_aktif
                FROM access_user as au 
                LEFT JOIN users as u ON au.user_id = u.id OR au.user_id = u.parent_id
                LEFT JOIN exams AS e ON u.id = e.user_id
                LEFT JOIN users AS child ON u.id = child.parent_id
                WHERE u.id = ? 
                AND DATE(au.start_date) <= CURRENT_DATE
                AND DATE(au.expired_at) >= CURRENT_DATE
                GROUP BY au.id , au.start_date , u.id, e.user_id`; 

    db.query(query , [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 
                    message: 'Internal Server Error ' + err , 
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

const updateExams = (req , res) => {
    
}

module.exports = { getExams , getDashboard ,getGrouping , getUsers };
