// controllers/examController.js
const db = require('../config/database'); 

const getDataUser = (req, res) => {
    const id = req.fields.id;
    const query = `SELECT 
                        u.id as user_id,
                        u.username,
                        u.role,
                        u.token_app AS token_user,
                        au.token AS token_sistem,
                        au.start_date,
                        au.expired_at,
                        au.limit_exam,
                        au.limit_user,
                        CASE WHEN u.token_app = au.token THEN 1 ELSE 0 END AS token_status,
                            CASE WHEN CURRENT_DATE <= au.expired_at AND CURRENT_DATE >= au.start_date THEN 1 ELSE 0 END AS status_aktif
                    FROM access_user as au 
                    LEFT JOIN users as u ON au.user_id = u.id
                    WHERE u.id = ` + id; 

    db.query(query, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data ujian:', err);
            return res.status(500).json({ error: 'Failed to fetch exams' });
        }

        res.json(results);
    });
};

module.exports = { getDataUser };
