// Import required modules
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Create an Express app
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Store WebSocket connections
let connections = [];

// Handle WebSocket connection
wss.on('connection', (ws) => {
    console.log('A client has connected');
    
    // Add new WebSocket connection to the connections array
    connections.push(ws);
    
    // Handle messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        
        connections.forEach(client => {
            if (client !== ws) {
                client.send(message);
            }
        });
    });

    // Handle WebSocket connection closure
    ws.on('close', () => {
        console.log('A client has disconnected');
        connections = connections.filter(client => client !== ws);
    });
});

// Serve static files (for pages)
app.use(express.static('public'));

// Start the server
server.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
});
