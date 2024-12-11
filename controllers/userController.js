// controllers/examController.js
const db = require('../config/database'); 

const getDataUser = (req, res) => {
    const id = req.query.id;
    const query = `SELECT 
                        u.id as user_id,
                        u.username,
                        u.role,
                        u.token_app AS token_user,
                        --au.token AS token_sistem,
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
            return res.status(500).json({ message: 'Failed to fetch users' , success:false });
        }

        res.json({message:'data has been loaded',success:true , data:results});
    });
};

const updateToken = (req, res) => {
    const id = req.query.id;
    const token = req.query.new_token;

    if (!id || !token) {
        return res.status(400).send({ message: 'ID and new token are required' , success : false});
    }

    const query = 'UPDATE users SET token_app = ? WHERE id = ?';

    database.query(query, [token, id], (error, results) => {
        if (error) {
            return res.status(500).send({ message: 'Server error', success : false });
        }

        if (results.affectedRows > 0) {
            res.send({ message: 'Token updated successfully' , success : true });
        } else {
            res.status(404).send({ message: 'User not found' , success : false});
        }
    });
};


module.exports = { getDataUser , updateToken};
