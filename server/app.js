const express = require('express');
const router = express.Router();

let products = [];
let users = [];
let sessions = {};

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    const session = sessions[req.headers['session-id']];
    if (session && session.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    const session = sessions[req.headers['session-id']];
    if (session) {
        req.user = session;
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

// User login
router.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const sessionId = new Date().toISOString();
        sessions[sessionId] = { role: user.role, username: user.username };
        res.send({ sessionId, role: user.role });
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Add a product (admin only)
router.post('/products', isLoggedIn, isAdmin, (req, res) => {
    const product = req.body;
    products.push(product);
    res.status(201).send('Product added');
});

// List products
router.get('/products', (req, res) => {
    res.send(products);
});

// User registration
router.post('/users/register', isLoggedIn, isAdmin, (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).send('Missing required fields');
    }
    if (role !== 'user' && role !== 'admin') {
        return res.status(400).send('Invalid role');
    }
    users.push({ username, password, role, purchases: [] });
    res.status(201).send('User registered');
});


// User login
router.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const sessionId = new Date().toISOString();
        sessions[sessionId] = { role: user.role, username };
        res.send({ sessionId, role: user.role });
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Purchase a product
router.post('/purchase', isLoggedIn, (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    if (product && product.quantity >= quantity) {
        product.quantity -= quantity;
        const purchase = { productId, quantity, date: new Date() };
        const user = users.find(u => u.username === req.user.username);
        user.purchases.push(purchase);
        res.send(purchase);
    } else {
        res.status(400).send('Invalid purchase');
    }
});

// View purchase history
router.get('/users/purchases', isLoggedIn, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    res.send(user.purchases);
});

// Delete a product (admin only)
router.delete('/products/:id', isAdmin, (req, res) => {
    const id = req.params.id;
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        res.status(200).send('Product deleted');
    } else {
        res.status(404).send('Product not found');
    }
});

// Add a product (admin only)
router.post('/products', isAdmin, (req, res) => {
    const product = req.body;
    // Add the product to your database
    // ...
    res.status(201).send('Product added');
});

module.exports = router;