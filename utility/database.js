// Fungsi queryAsync yang membungkus db.query dalam Promise
const db = require('../config/database'); 

async function queryAsync(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);  // Menolak promise jika ada error
            } else {
                resolve(results);  // Menyelesaikan promise dengan hasil query
            }
        });
    });
}

module.exports = { queryAsync };
