document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const cart = [];

    // Render login form
    function renderLoginForm() {
        app.innerHTML = `
            <h2>Login</h2>
            <form id="login-form">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <li><a href="register.html" id="register">Register</a></li>
                <button type="submit">Login</button>
            </form>
        `;
        document.getElementById('login-form').addEventListener('submit', login);
    }

    // Render register form
    function renderRegisterForm() {
        app.innerHTML = `
            <h2>Register</h2>
            <form id="register-form">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Register</button>
            </form>
        `;
        document.getElementById('register-form').addEventListener('submit', register);
    }

    function renderStore(role) {
        renderProductList([]);

        if (role === 'admin') {
            const adminButton = document.createElement('button');
            adminButton.textContent = 'Agregar Producto';
            adminButton.onclick = () => {
                window.location.href = '/add_product.html';
            };

            const cartButtonContainer = document.getElementById('admin-cart-buttons');
            cartButtonContainer.appendChild(adminButton);
        }
    }


    // Render product list
    function renderProductList(products) {
        app.innerHTML = `
            <h2>Products</h2>
            <div class="product-list">
                ${products.map(product => `
                    <div class="product-item">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>$${product.price}</p>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Render cart
    function renderCart(cartItems) {
        app.innerHTML = `
            <h2>Cart</h2>
            ${cartItems.map(item => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.quantity} x $${item.price}</span>
                </div>
            `).join('')}
            <button onclick="checkout()">Checkout</button>
        `;
    }

    // Login function
    function login(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;

        fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.sessionId) {
                    sessionStorage.setItem('sessionId', data.sessionId);
                    alert('Login successful');
                    renderStore(data.role);
                    window.location.href = 'store.html';
                } else {
                    alert('Login failed');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Register function
    function register(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;

        fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                window.location.href = 'login.html';
            })
            .catch(error => console.error('Error:', error));
    }

    // Add to cart function
    function addToCart(productId) {
        // Logic to add product to cart
    }

    // Checkout function
    function checkout() {
        // Logic to checkout
    }

    // Check the current page and render the appropriate form or page
    if (window.location.pathname.endsWith('login.html')) {
        renderLoginForm();
    } else if (window.location.pathname.endsWith('register.html')) {
        renderRegisterForm();
    } else if (window.location.pathname.endsWith('index.html')) {
        // You can render the main page content or products list here
    }

    // Add navigation links functionality
    document.getElementById('products-link')?.addEventListener('click', () => renderProductList([]));
    document.getElementById('cart-link')?.addEventListener('click', () => renderCart([]));

    // Redirect to login page if trying to access index.html without being logged in
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        if (!sessionStorage.getItem('sessionId')) {
            window.location.href = 'login.html';
        }
    }
});
