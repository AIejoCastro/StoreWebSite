const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

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
let products = []; // Aquí se almacenarán los productos

// Middleware para verificar si el usuario es administrador
function isAdmin(req, res, next) {
    const sessionId = req.headers['session-id'];
    const username = sessions[sessionId];

    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    const user = users.find(user => user.username === username);

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

// Ruta para registrar usuarios
app.post('/api/users/register', (req, res) => {
    const { username, password, role } = req.body;
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).send('User already exists');
    }

    users.push({ username, password });
    res.redirect('/user_type.html'); // Redirigir después del registro
});

// Ruta para iniciar sesión
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const sessionId = Math.random().toString(36).substring(2);
    sessions[sessionId] = username;
    res.json({ sessionId, role: user.role });
});

// Ruta para agregar productos (solo para administradores)
app.post('/api/products', isAdmin, (req, res) => {
    const { name, description, price } = req.body;
    const id = products.length + 1;
    products.push({ id, name, description, price });
    res.status(201).send('Product added successfully');
});

// Ruta para obtener productos
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Capturar todas las demás rutas y redirigir a la página principal
app.get('/', (req, res) => {
    res.redirect('/register.html');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
