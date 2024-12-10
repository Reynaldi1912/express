const express = require('express');
const app = express();
const authenticateToken = require('./middleware/auth');
const routes = require('./routes/route');
const port = 3000;

app.use(express.json());

// Rute yang dilindungi
app.use(authenticateToken);
app.use(routes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
