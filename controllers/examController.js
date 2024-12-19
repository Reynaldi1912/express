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

const getBankQuestion = (req , res) => {
    const id = req.header('UserId');
    const query = `SELECT 
                        qb.*,
                        COUNT(CASE WHEN q.type = 'multiple' THEN 1 END) AS total_multiple,
                            COUNT(CASE WHEN q.type = 'complex' THEN 1 END) AS total_complex,
                        COUNT(CASE WHEN q.type = 'text' THEN 1 END) AS total_text,
                        COUNT(CASE WHEN q.type = 'match' THEN 1 END) AS total_match
                    FROM question_banks AS qb
                    LEFT JOIN questions AS q ON qb.id = q.question_bank_id
                    WHERE user_id = ?
                    GROUP BY qb.id;
                    `; 

    
    db.query(query , [id], (err, results) => {
        console.log(id);
        
        if (err) {
            return res.status(500).json({ 
                    message: 'Internal Server Error ' + err , 
                    success : false}
            );
        }

        if (results.length > 0) {
            res.json(
                {
                    data : results , 
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
}


const getDataExamUser = (req , res) => {
    user_id = req.header('userId')

    query = `SELECT 
                e.name,
                    DATE(e.start_date) AS date,
                    TIME(e.start_date) AS start_time,
                    TIME(e.end_date) AS end_time,
                    CASE 
                        WHEN e.start_date > CURRENT_TIMESTAMP THEN 'Waiting'
                        WHEN e.end_date < CURRENT_TIMESTAMP THEN 'Expired'
                        ELSE 'Kerjakan' 
                    END AS status,
                JSON_ARRAYAGG(g.name) AS group_ids
            FROM 
                exams AS e LEFT JOIN groupings AS g ON FIND_IN_SET(g.id, e.grouping_list_ids)
                    LEFT JOIN users AS u ON g.id = u.grouping_id
            WHERE TRUE AND e.user_id = (select parent_id from users where id = ?)
            AND NOT FIND_IN_SET(?, e.except_user_ids)
            AND FIND_IN_SET(u.grouping_id, e.grouping_list_ids)
            GROUP BY 
                e.id
            ORDER BY 
                ABS(DATEDIFF(e.start_date, CURDATE())) ASC
            `
        db.query(query , [user_id , user_id], (err, results) => {
            console.log(user_id);
            
            if (err) {
                return res.status(500).json({ 
                        message: 'Internal Server Error ' + err , 
                        success : false}
                );
            }
    
            if (results.length > 0) {
                res.json(
                    {
                        data : results , 
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
}


const getQuestionUser = (req, res) => {
    const questionsData = {
        "questions": [
          {
            "id": 1,
            "question": "Ibu kota Indonesia?",
            "options": [
              { "id": "A", "text": "Jakarta" },
              { "id": "B", "text": "Bandung" },
              { "id": "C", "text": "Surabaya" },
              { "id": "D", "text": "Yogyakarta" }
            ],
            "answer": "A"
          },
          {
            "id": 2,
            "question": "Berapa hasil dari 2 + 3?",
            "options": [
              { "id": "A", "text": "4" },
              { "id": "B", "text": "5" },
              { "id": "C", "text": "6" },
              { "id": "D", "text": "7" }
            ],
            "answer": "B"
          },
          {
            "id": 3,
            "question": "Pilih jawaban yang benar: 5 x 5 = ?",
            "options": [
              { "id": "A", "text": "15" },
              { "id": "B", "text": "25" },
              { "id": "C", "text": "30" },
              { "id": "D", "text": "35" }
            ],
            "answer": "B"
          },
          {
            "id": 4,
            "question": "Cobaa sapaan indonesia",
            "type": "essay",
            "options": null,
            "answer": "Halo"
          },
          {
            "id": 5,
            "question": "Cocokkan pertanyaan dengan jawaban berikut:",
            "type": "matching",
            "options": [
              { "id": "1", "text": "Ibu kota Indonesia" },
              { "id": "2", "text": "Warna langit" },
              { "id": "3", "text": "Hewan yang menggonggong" }
            ],
            "answers": {
              "1": "Jakarta",
              "2": "Biru",
              "3": "Anjing"
            }
          }
        ]
    };

    // Jika ada parameter 'id' di URL, cari soal berdasarkan id
    const number = req.query.number - 1;
        
    if (number != null) {
        // Cari soal berdasarkan id
        const question = questionsData.questions[number];
        
        if (question) {
            res.json(question); // Kirimkan soal yang sesuai
        } else {
            res.status(404).json({ message: "Soal tidak ditemukan" }); // Jika soal tidak ditemukan
        }
    } else {
        // Jika tidak ada id, kirimkan seluruh data soal
        res.json(questionsData);
    }
};


const numberOfPage = (req,res) => {
    const id = req.query.id;
    const query = `SELECT 
                        number_of, type
                    FROM questions AS q where question_bank_id = ?
                    `; 

    
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
                    data : results , 
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
}


const updateExams = (req , res) => {
    
}

module.exports = { getExams , getDashboard ,getGrouping , getUsers , getBankQuestion , getDataExamUser , getQuestionUser , numberOfPage };
