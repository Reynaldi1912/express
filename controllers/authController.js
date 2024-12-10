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

module.exports = { login_POST };
