// controllers/examController.js
const db = require('../config/database'); 

const getDataUser = (req, res) => {
    const id = req.query.id;
    const query = `SELECT 
                            u.id as user_id,
                            u.username,
                            u.role,
                            u.parent_id,
                            COALESCE(u.token_app , (SELECT token_app FROM users WHERE id = u.parent_id)) AS token_user,
                            au.start_date,
                            au.expired_at,
                            au.limit_exam,
                            au.limit_user,
                            CASE WHEN (SELECT token_app FROM users WHERE id = u.parent_id) = au.token THEN 1 ELSE 0 END AS token_status,
                            CASE WHEN CURRENT_DATE <= au.expired_at AND CURRENT_DATE >= au.start_date THEN 1 ELSE 0 END AS status_aktif
                    FROM access_user as au 
                    LEFT JOIN users as u ON au.user_id = u.id OR au.user_id = u.parent_id
                    WHERE TRUE AND CURRENT_DATE <= au.expired_at AND CURRENT_DATE >= au.start_date AND u.id = ?` ;     

    db.query(query , [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to fetch users' , success:false });
        }
        res.json({message:'data has been loaded',success:true , data:results});
    });
};

const getDataUserMaster = (req, res) => {
    const id = req.query.userId;
    const query = `SELECT 
                        * 
                    FROM users AS u
                    WHERE TRUE AND u.parent_id = ?` ;     

    
    db.query(query , [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to fetch users ' + err , success:false });
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



module.exports = { getDataUser , updateToken , getDataUserMaster};
