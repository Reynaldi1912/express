const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost', // Ganti dengan host database Anda
  user: 'root',      // Ganti dengan username database Anda
  password: '',      // Ganti dengan password database Anda
  database: 'exam_app' // Ganti dengan nama database Anda
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = db;
