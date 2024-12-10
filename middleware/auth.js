// Middleware untuk memvalidasi token
const db = require('../config/database'); // Pastikan sudah mengimpor koneksi database

function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const userId = req.header('UserId');
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Token tidak disediakan!' , success: false });
    }

    const query = "SELECT * FROM access_user where user_id = "+userId +" AND token = '"+token+"'"; 
    db.query(query, (err, results) => {
        console.log(results);

        if(results){
            if (results.length > 0) {
                next(); // Token valid, lanjut ke route berikutnya
            } else {
                res.json(
                    { 
                        message: 'token tidak valid' , 
                        success : false 
                    }
                );
            }
        }else{
            res.json(
                { 
                    message: 'token tidak ditemukan' , 
                    success : false 
                }
            );
        }
    })
}

module.exports = authenticateToken;
