const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let products = [];
let users = [];
let sessions = {};
let carts = {}; // Carritos de compras de los usuarios

function isAdmin(req, res, next) {
    const session = sessions[req.headers['session-id']];
    if (session && session.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

function isLoggedIn(req, res, next) {
    const session = sessions[req.headers['session-id']];
    if (session) {
        req.user = session;
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

router.post('/users/register', (req, res) => {
    const { username, password, role } = req.body;
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).send('User already exists');
    }

    users.push({ username, password, role });
    res.send('User registered successfully');
});

router.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const sessionId = uuidv4();
    sessions[sessionId] = { sessionId, username, role: user.role };
    res.json({ sessionId, role: user.role });
});

router.post('/products', isLoggedIn, isAdmin, (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || typeof price !== 'number' || isNaN(price) || price < 0) {
        return res.status(400).send('Invalid input');
    }

    const product = { id: uuidv4(), name, description, price };
    products.push(product);
    res.status(201).json({ message: 'Product added successfully', product });
});

router.get('/products', (req, res) => {
    res.json(products);
});

router.delete('/products/:id', isLoggedIn, isAdmin, (req, res) => {
    const id = req.params.id;
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        products.splice(index, 1);
        res.status(200).send('Product deleted');
    } else {
        res.status(404).send('Product not found');
    }
});

// Ruta para obtener el carrito de compras del usuario
router.get('/cart', isLoggedIn, (req, res) => {
    const userId = req.user.username;
    const userCart = carts[userId] || [];
    res.json(userCart);
});

// Ruta para añadir un producto al carrito de compras
router.post('/cart/add', isLoggedIn, (req, res) => {
    const userId = req.user.username;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).send('Producto no especificado');
    }

    if (!carts[userId]) {
        carts[userId] = [];
    }

    carts[userId].push(productId);
    res.json({ message: 'Producto añadido al carrito', cart: carts[userId] });
});

module.exports = router;
