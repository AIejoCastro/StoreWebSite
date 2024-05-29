const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Necesario para resolver rutas

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

let users = []; // Aquí se almacenarán los usuarios registrados
let sessions = {}; // Aquí se almacenarán las sesiones activas

// Rutas de la API
app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).send('User already exists');
    }

    users.push({ username, password });
    res.redirect('/user_type.html'); // Redirigir después del registro
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

// Capturar todas las demás rutas y redirigir a la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
