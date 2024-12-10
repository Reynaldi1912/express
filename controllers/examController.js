// controllers/examController.js
const db = require('../config/database'); // Pastikan sudah mengimpor koneksi database

const getExams = (req, res) => {
    const query = 'SELECT * FROM users'; // Ganti sesuai dengan query yang Anda butuhkan

    db.query(query, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data ujian:', err);
            return res.status(500).json({ error: 'Failed to fetch exams' });
        }

        res.json(results);
    });
};

module.exports = { getExams };
