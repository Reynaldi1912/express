const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connections = [];

wss.on('connection', (ws) => {
    console.log('A client has connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message); // Asumsikan pesan dalam format JSON

        console.log('message');
        
        // Jika data memiliki user_id, simpan di koneksi
        if (data.type === 'register') {
            ws.user_id = data.user_id; // Simpan user_id
            console.log(`Registered user_id: ${ws.user_id}`);
        }

        // Kirim pesan ke user tertentu jika ada target_user_id
        if (data.type === 'message' && data.target_user_id) {
            emitToUser(data.target_user_id, data.message);
        } else {
            // Kirim pesan ke semua klien kecuali pengirim
            connections.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log(`Client with user_id ${ws.user_id} disconnected`);
        connections = connections.filter(client => client !== ws);
    });

    connections.push(ws);
});

function emitToUser(userId, message) {
    const targetClient = connections.find(client => client.user_id === userId);
    if (targetClient && targetClient.readyState === WebSocket.OPEN) {
        targetClient.send(JSON.stringify({ message: message }));
        console.log(`Message sent to user_id ${userId}: ${message}`);
    } else {
        console.log(`User with user_id ${userId} not found or not connected`);
    }
}

app.use(express.static('public'));

server.listen(8080, '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:8080`);
});
