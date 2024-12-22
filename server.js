const express = require('express');
const cors = require('cors');
const formidable = require('express-formidable'); // Middleware untuk menangani form-data
const app = express();
const routes = require('./routes/route'); // Pastikan ini sesuai dengan lokasi file route.js Anda
const port = 7000;

// Konfigurasi CORS
const corsOptions = {
    origin: '*', // Mengizinkan semua origin
    methods: ['GET', 'POST'], // Mendukung GET dan POST
    allowedHeaders: ['Content-Type', 'Authorization' , 'UserId'], // Header yang diizinkan
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware untuk menangani JSON
app.use(formidable()); // Middleware untuk menangani form-data
app.use(routes); // Menggunakan routing dari file route.js

// app.listen(port, () => {
//     console.log(`Server berjalan di http://localhost:${port}`);
// });

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:${port}`);
});
