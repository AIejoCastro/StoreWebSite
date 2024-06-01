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
                <li><a href="register.html" id="register">Register</a></li>
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
                <label for="role">Role:</label>
                <select id="role" name="role" required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Register</button>
            </form>
        `;
        document.getElementById('register-form').addEventListener('submit', register);
    }

    function renderStore() {
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                renderProductList(products);
                const role = sessionStorage.getItem('role');
                if (role === 'admin') {
                    const adminButton = document.createElement('button');
                    adminButton.textContent = 'Add Product';
                    adminButton.onclick = () => {
                        window.location.href = 'add_product.html';
                    };
                    app.appendChild(adminButton);
                }
            });
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

    function renderAddProductForm() {
        app.innerHTML = `
            <h2>Add Product</h2>
            <form id="add-product-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="description">Description:</label>
                <input type="text" id="description" name="description" required>
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" required>
                <button type="submit">Add Product</button>
            </form>
        `;
        document.getElementById('add-product-form').addEventListener('submit', addProduct);
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
                    sessionStorage.setItem('role', data.role);
                    alert('Login successful');
                    window.location.href = 'store.html';
                } else {
                    alert('Login failed');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function register(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        const role = event.target.role.value;

        fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                window.location.href = 'login.html';
            })
            .catch(error => console.error('Error:', error));
    }

    function addProduct(event) {
        event.preventDefault();
        const name = event.target.name.value;
        const description = event.target.description.value;
        const price = parseFloat(event.target.price.value);

        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-id': sessionStorage.getItem('sessionId')
            },
            body: JSON.stringify({ name, description, price })
        })
            .then(response => response.json())
            .then(data => {
                alert('Product added successfully');
                window.location.href = 'store.html';
            })
            .catch(error => console.error('Error:', error));
    }

    if (window.location.pathname.endsWith('login.html')) {
        renderLoginForm();
    } else if (window.location.pathname.endsWith('register.html')) {
        renderRegisterForm();
    } else if (window.location.pathname.endsWith('store.html')) {
        renderStore();
    } else if (window.location.pathname.endsWith('add_product.html')) {
        renderAddProductForm();
    }
});
