// controllers/examController.js
const { json } = require('express');
const db = require('../config/database'); 
const { queryAsync } = require('../utility/database');  // Mengimpor fungsi queryAsync

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

    console.log(user_id);
    
    query = `SELECT 
                    e.id,
                    e.name,
                    e.end_date,
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
            AND NOT FIND_IN_SET(3, COALESCE(e.except_user_ids,0))
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


async function getQuestionUser(req, res) {
    const queryQuestion = `SELECT * FROM questions WHERE question_bank_id = 1 AND number_of = ?`;
   
    // Query untuk mendapatkan soal berdasarkan `number_of`
    
    const questionResults = await queryAsync(queryQuestion, [req.query.number]);
    
    if (questionResults.length > 0) {
        const id = questionResults[0].id; // ID dari soal
        const question = questionResults[0].question; // Teks soal
        const type = questionResults[0].type;

        const queryOption = `SELECT id, text FROM options WHERE question_id = ?`;
        const queryOptionUser = `SELECT option_id, text FROM options_user WHERE question_id = ? AND user_id = ?`;

        let match_question = null;
        let option_second = null;
        let data_answer = {};
        const total_page = await queryAsync(`SELECT COUNT(*) AS total FROM questions WHERE question_bank_id = 1`, [id]);
        
        if(type == 'match'){
            const queryMatchQuestion = `SELECT id, text AS 'question' FROM options WHERE question_id = ? `;
            const queryOptionSecond = `SELECT id, match_text AS 'option' FROM options WHERE question_id = ? `;

            const first_query = `SELECT id FROM options WHERE question_id = ?`;
            const answer_query = `SELECT option_id FROM options_user WHERE question_id = ?`;
            
            // Ambil data first_option dan answer_user
            const first_option = await queryAsync(first_query, [id]);
            
            const answer_user = await queryAsync(answer_query, [id]);
            
            // Ambil string jawaban pengguna (misalnya "6,null,7")
            const userAnswers = answer_user.length > 0 ? answer_user[0].option_id.split(',') : [];
            
            // Buat data_answer dengan memetakan key dari first_option dan value dari userAnswers
            first_option.forEach((option, index) => {
                data_answer[option.id] = userAnswers[index] !== 'null' && userAnswers[index] !== undefined   && userAnswers[index] !== NaN
                    ? parseInt(userAnswers[index], 10) 
                    : null;
            });            
                        

            match_question = await queryAsync(queryMatchQuestion, [id ]);
            option_second = await queryAsync(queryOptionSecond, [id]);            
        }


        db.query(queryOption, [id], (err, optionResults) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error (Options): ' + err,
                    success: false
                });
            }

            const options = optionResults.map((option) => ({
                id: option.id,
                text: option.text
            }));
            

            
            db.query(queryOptionUser, [id, req.query.user_id], (err, userAnswerResults) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error (User Answer): ' + err,
                        success: false
                    });
                }

                
                let answer = null;
                if(userAnswerResults.length > 0){
                    if (userAnswerResults[0].option_id != '' && userAnswerResults[0].option_id != null) {
                        answer = userAnswerResults[0].option_id
                        .split(',')
                        .map((id) => ({ option_id: Number(id) }));
                    }else if(userAnswerResults[0].text != '' && userAnswerResults[0].text != null){
                        answer =  userAnswerResults[0].text;
                    }
                }

                console.log(data_answer);
                
                
                res.json({
                    id: id,
                    question: question,
                    options: options,
                    answer: answer,
                    match_question: match_question,
                    option_second : option_second,
                    match_answer : data_answer,
                    type : type,
                    total_page : total_page[0]['total']
                });
            });
        });
    } else {
        res.status(404).json({ message: "Soal tidak ditemukan" }); // Jika soal tidak ditemukan
    }
};





const numberOfPage = async (req,res) => {
    const id = req.query.id;
    const user_id = req.query.user_id;
    console.log("id" , id);
    console.log("user_id" , user_id);
    
    const query = `select 
                        q.id , 
                        number_of , 
                        type,
                       	case 
                            when ou.is_doubt = 1 then -1
                            when (ou.option_id is not null and ou.text is not null) then 1 
                            else 0 
                        end as status 
                    from options_user ou right join questions as q on ou.question_id= q.id AND ou.user_id = ?
                    where q.question_bank_id = ?
                    `;

        db.query(query , [user_id ,id], (err, results) => {
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
const answerQuestion = async (req, res) => {    
    const { 
        question_id, 
        answer: option_answer = null,
        user_id, 
        essay = null,
        doubt,
    } = req.fields;
        
    if (!question_id || !user_id) {
        return res.status(400).json({ message: "question_id, answer, and user_id are required." });
    }
        
    if ((!option_answer || option_answer === '') && (!essay || essay === '')) {
        return res.status(200).json({ message: "Tidak ada yang disimpan." });
    }
    
    const check = await queryAsync(`select option_id, text from options_user where user_id = ? and question_id = ?`, [user_id , question_id]);
    
    
    
    if(check.length > 0){
        console.log('doubt' , doubt);
        if(check[0].option_id != option_answer || check[0].text != essay){
            try {          
                await db.query(
                    "DELETE FROM options_user WHERE user_id = ? AND question_id = ?",
                    [user_id, question_id]
                );
                
                await db.query(
                    "INSERT INTO options_user (question_id, option_id, user_id , text) VALUES (?, ?, ? , ?)",
                    [question_id, option_answer, user_id , essay ]
                );

                await db.query(
                    "UPDATE options_user SET is_doubt = ? WHERE user_id = ? AND question_id = ?",
                    [doubt, user_id, question_id ]
                );
                res.status(200).json({ message: "Answer updated successfully." });
        
            } catch (error) {
                console.error("Error updating answer:", error);
                res.status(500).json({ message: "Internal server error." });
            }
        }else{
            await db.query(
                "UPDATE options_user SET is_doubt = ? WHERE user_id = ? AND question_id = ?",
                [doubt, user_id, question_id]
            );
            res.status(200).json({ message: "Tidak ada perubahan" });
        }
    }else{
        await db.query(
            "INSERT INTO options_user (question_id, option_id, user_id , text) VALUES (?, ?, ? , ?)",
            [question_id, option_answer, user_id , essay]
        );

        await db.query(
            "UPDATE options_user SET is_doubt = ? WHERE user_id = ? AND question_id = ?",
            [doubt, user_id, question_id]
        );
        res.status(200).json({ message: "Answer updated successfully." });
    }
};

async function finishExam(req , res){
    exam_id = req.fields.exam_id;
    user_id = req.fields.user_id;

    await queryAsync(`UPDATE status_user SET is_finish = 1 WHERE user_id = ? AND exam_id = ?`, [user_id , exam_id]);
    res.status(200).json({ message: "Finish" });
}

module.exports = { getExams , getDashboard ,getGrouping , getUsers , getBankQuestion , getDataExamUser , getQuestionUser , numberOfPage , answerQuestion, finishExam };
