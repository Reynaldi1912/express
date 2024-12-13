// controllers/examController.js
const { console } = require('inspector');
const db = require('../config/database'); // Pastikan sudah mengimpor koneksi database
const crypto = require('crypto');


function md5Hash(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

const login_POST = (req, res) => {
    const username = req.fields.username;
    const password = req.fields.password;
    const role = req.fields.role;
    
    const hashedPassword = md5Hash(password);

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Gagal mengambil data users:', err);
            return res.status(500).json({ message: 'Internal Server Error' , success : false});
        }

        if (results.length > 0) {
            res.json({data : results , success : true});
        } else {
            res.status(401).json({ message: 'Invalid username or password' , success : false });
        }
    });
};

const getTokenUser = (req, res) => {
    const id = req.query.userId;
    const query = "SELECT * FROM users where id = ?"; 

    db.query(query , [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 
                    message: 'Internal Server Error' , 
                    success : false}
            );
        }

        console.log(results);
        

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

const getTokenApp = (req, res) => {
    const id = req.query.userId;
    const query = "SELECT * FROM access_user where user_id = ? AND CURRENT_DATE BETWEEN start_date AND expired_at order by id desc limit 1"; 

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
const updateToken = (req, res) => {
    const new_token = req.fields.new_token;
    const id = req.fields.id; 

    if (!id || !new_token) {
        return res.status(400).json({ message: 'id and new_token are required' });
    }

    console.log(id);
    console.log(new_token);

    const sql = `UPDATE users SET token_app = ? WHERE id = ?`;

    db.query(sql, [new_token, id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update token', error , success:false });
        }

        return res.status(200).json({ message: 'Token updated successfully', results , success:true });
    });
};



module.exports = { login_POST , getTokenApp , getTokenUser , updateToken };
