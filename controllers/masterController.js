// controllers/examController.js
const { json } = require('express');
const db = require('../config/database'); 
const { queryAsync } = require('../utility/database');  // Mengimpor fungsi queryAsync
const crypto = require('crypto');

async function insertUser(req, res) {
    const { username, grouping, password, user_id_session: parent_id } = req.fields;

    // Validasi input
    if (!username || !password || !grouping || !parent_id) {
        return res.status(400).json({ message: 'Semua field harus diisi.' });
    }

    try {
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        const query = `
            INSERT INTO users (username, password, role, parent_id, grouping_id, is_active) 
            VALUES (?, ?, 'user', ?, ?, 1)
        `;
        const params = [username, hashedPassword, parent_id, grouping];

        await db.query(query, params);

        res.status(200).json({ message: 'User berhasil ditambahkan ke grouping.' });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan user.' });
    }
}

async function deleteUser(req, res) {
    const { user_id } = req.fields;

    if (!user_id) {
        return res.status(400).json({ message: 'user_id harus diisi.' });
    }

    try {
        const query = `DELETE FROM users WHERE id = ?`;
        const params = [user_id];

        await db.query(query, params);

        res.status(200).json({ message: 'User berhasil dihapus.' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus user.' });
    }
}

async function updateUser(req, res) {
    const { user_id, username, grouping, password, user_id_session: parent_id  , status} = req.fields;

    // Validasi input
    if (!user_id || !username || !grouping || !parent_id) {
        return res.status(400).json({ message: 'user_id, username, grouping, dan parent_id harus diisi.' });
    }

    try {
        let query = `
            UPDATE users 
            SET username = ?, 
                parent_id = ?, 
                grouping_id = ?,
                is_active = ?
        `;
        const params = [username, parent_id, grouping , status];

        // Jika password tidak null atau kosong, tambahkan ke query dan params
        if (password && password.trim() !== '') {
            const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
            query += `, password = ?`;
            params.push(hashedPassword);
        }

        query += ` WHERE id = ?`;
        params.push(user_id);

        await db.query(query, params);

        res.status(200).json({ message: 'User berhasil diperbarui.' });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui user.' });
    }
}

async function insertGrouping(req, res) {
    const { name, level , user_id } = req.fields;

    // Validasi input
    if (!name || !level || !user_id) {
        return res.status(400).json({ message: 'Nama dan level harus diisi.' });
    }

    try {
        const query = `
            INSERT INTO groupings (name, level, user_id) 
            VALUES (?,?,?)
        `;
        const params = [name, level, user_id];

        await db.query(query, params);

        res.status(200).json({ message: 'Grouping berhasil ditambahkan.' });
    } catch (error) {
        console.error("Error inserting grouping:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan grouping.' });
    }
}

// Menghapus grouping berdasarkan ID
async function deleteGrouping(req, res) {
    const { grouping_id } = req.fields;

    if (!grouping_id) {
        return res.status(400).json({ message: 'grouping_id harus diisi.' });
    }

    try {
        // Check if any user is assigned to the grouping_id
        const checkQuery = `SELECT COUNT(*) AS userCount FROM users WHERE grouping_id = ?`;
        const checkParams = [grouping_id];

        const checkResult = await queryAsync(checkQuery,checkParams);
  
        
        // If users are assigned to this grouping, prevent deletion
        if (checkResult[0].userCount > 0) {
            return res.status(200).json({ message: 'Tidak bisa menghapus grouping karena ada user yang menggunakan grouping ini.' });
        }

        // Proceed with deletion if no users are assigned
        const query = `DELETE FROM groupings WHERE id = ?`;
        const params = [grouping_id];

        await db.query(query, params);

        res.status(200).json({ message: 'Grouping berhasil dihapus.' });
    } catch (error) {
        console.error("Error deleting grouping:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus grouping.' });
    }
}

// Memperbarui grouping
async function updateGrouping(req, res) {
    const { grouping_id, name, level } = req.fields;

    // Validasi input
    if (!grouping_id || !name || !level) {
        return res.status(400).json({ message: 'grouping_id, name, dan level harus diisi.' });
    }

    try {
        const query = `
            UPDATE groupings
            SET name = ?, level = ?
            WHERE id = ?
        `;
        const params = [name, level, grouping_id];

        await db.query(query, params);

        res.status(200).json({ message: 'Grouping berhasil diperbarui.' });
    } catch (error) {
        console.error("Error updating grouping:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui grouping.' });
    }
}

// Mengambil daftar semua grouping
async function getGroupings(req, res) {
    try {
        const query = `SELECT * FROM groupings`;
        const groupings = await queryAsync(query);

        res.status(200).json({ data: groupings });
    } catch (error) {
        console.error("Error fetching groupings:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data grouping.' });
    }
}



module.exports = { insertUser , deleteUser , updateUser , insertGrouping, deleteGrouping, updateGrouping, getGroupings };
