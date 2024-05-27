document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    function renderLoginForm() {
        app.innerHTML = `
            <h2>Login</h2>
            <form id="login-form">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Login</button>
            </form>
        `;
        document.getElementById('login-form').addEventListener('submit', login);
    }

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

    function login(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.sessionId) {
                    sessionStorage.setItem('sessionId', data.sessionId);
                    alert('Login successful');
                    window.location.href = 'index.html';
                } else {
                    alert('Login failed');
                }
            });
    }

    function register(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                window.location.href = 'login.html';
            });
    }

    function addToCart(productId) {
        // Add logic to add product to cart
    }

    function checkout() {
        // Add logic to checkout
    }

    // Navegación
    document.getElementById('products-link')?.addEventListener('click', () => renderProductList([]));
    document.getElementById('cart-link')?.addEventListener('click', () => renderCart([]));

    // Verifica la URL y redirige a login.html si es necesario
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        window.location.href = 'login.html';
    }
});
