const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import the uuid module

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

let users = []; // Store registered users
let sessions = {}; // Store active sessions
let products = []; // Store products
let carts = {}; // Store carts

// Middleware to check if user is admin
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

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    const sessionId = req.headers['session-id'];
    const username = sessions[sessionId];

    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    req.username = username;
    next();
}

// Route to register users
app.post('/api/users/register', (req, res) => {
    const { username, password, role } = req.body;
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).send('User already exists');
    }

    users.push({ username, password, role });
    res.send('User registered successfully');
});

// Route to login users
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const sessionId = uuidv4(); // Use uuid to generate a unique sessionId
    sessions[sessionId] = username;
    res.json({ sessionId, role: user.role });
});

// Route to add products (admin only)
app.post('/api/products', isAdmin, (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || typeof price !== 'number' || isNaN(price) || price < 0) {
        return res.status(400).send('Invalid input');
    }

    const id = uuidv4(); // Use uuid to generate a unique id

    const product = {
        id,
        name,
        description,
        price
    };

    products.push(product); // Add the product to the list

    res.status(201).json({ message: 'Product added successfully', product });
});

// Route to get products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Route to add product to cart (logged in users only)
app.post('/api/cart/add', isLoggedIn, (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    if (!carts[req.username]) {
        carts[req.username] = [];
    }

    carts[req.username].push(product);
    res.json({ message: 'Product added to cart', product });
});

// Route to get cart items (logged in users only)
app.get('/api/cart', isLoggedIn, (req, res) => {
    const cart = carts[req.username] || [];
    res.json(cart);
});

// Route to remove product from cart (logged in users only)
app.post('/api/cart/remove', isLoggedIn, (req, res) => {
    const { productId } = req.body;
    if (!carts[req.username]) {
        return res.status(400).send('Cart is empty');
    }

    carts[req.username] = carts[req.username].filter(p => p.id !== productId);
    res.json({ message: 'Product removed from cart' });
});

// Route to delete products (admin only)
app.delete('/api/products/:id', isAdmin, (req, res) => {
    const id = req.params.id;
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        products.splice(index, 1);
        res.status(200).send('Product deleted');
    } else {
        res.status(404).send('Product not found');
    }
});

// Capture all other routes and redirect to the login page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/login.html`);
});
