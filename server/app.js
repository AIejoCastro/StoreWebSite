const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = []; // Aquí se almacenarán los usuarios registrados
let sessions = {}; // Aquí se almacenarán las sesiones activas

app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).send('User already exists');
    }

    users.push({ username, password });
    res.send('User registered successfully');
});

app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const sessionId = Math.random().toString(36).substring(2);
    sessions[sessionId] = username;
    res.json({ sessionId });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
