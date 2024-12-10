// Middleware untuk memvalidasi token
function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Token tidak disediakan!' });
    }

    // Cek jika token sesuai dengan 'mysecret_key'
    if (token === 'mysecret_key') {
        next(); // Token valid, lanjut ke route berikutnya
    } else {
        return res.status(403).json({ error: 'Token tidak valid!' });
    }
}

module.exports = authenticateToken;
