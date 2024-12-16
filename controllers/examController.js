// controllers/examController.js
const db = require('../config/database'); 
const getExams = (req, res) => {
    const id = req.query.userId;

    const query = `SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'name', e.name,
                                    'date', DATE(e.start_date),
                                    'start_date', DATE_FORMAT(e.start_date, '%H:%i:%s'),  -- Format as HH:MM:SS
                                    'end_date', DATE_FORMAT(e.end_date, '%H:%i:%s'),  
                                    'user_id', e.user_id,
                                    'grouping_count' ,  CHAR_LENGTH(e.grouping_list_ids) - CHAR_LENGTH(REPLACE(e.grouping_list_ids, ',', '')) + 1,
                                    'grouping_list_ids', e.grouping_list_ids,
                                    'except_users' , CHAR_LENGTH(e.except_user_ids) - CHAR_LENGTH(REPLACE(e.except_user_ids, ',', '')) + 1,
                                    'except_user_ids', e.except_user_ids
                                )
                            ) AS datas
                    FROM exams AS e
                    LEFT JOIN 
                            groupings AS g
                            ON FIND_IN_SET(CAST(g.id AS CHAR), e.grouping_list_ids) > 0
                    LEFT JOIN users AS u 
                            ON FIND_IN_SET(CAST(g.id AS CHAR), e.except_user_ids) > 0
                    WHERE e.user_id = ?
                    GROUP BY 
                            e.id
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
            // Parse the 'datas' field from the first row in the result set
            const data = JSON.parse(results[0].datas);

            return res.json({
                data: data,
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

const updateExams = (req , res) => {
    
}

module.exports = { getExams , getDashboard };
