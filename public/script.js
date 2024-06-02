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
                const cartButton = document.createElement('button');
                cartButton.textContent = 'View Cart';
                cartButton.onclick = () => {
                    window.location.href = 'cart.html';
                };
                app.appendChild(cartButton);
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
                        <button onclick="addToCart('${product.id}')">Add to Cart</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderAddProductForm() {
        app.innerHTML = `
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

    function renderCart() {
        fetch('/api/cart', {
            headers: {
                'session-id': sessionStorage.getItem('sessionId')
            }
        })
            .then(response => response.json())
            .then(cartItems => {
                const cartList = document.createElement('div');
                cartList.classList.add('cart-list');

                if (cartItems.length === 0) {
                    cartList.innerHTML = '<p>Your cart is empty</p>';
                } else {
                    cartList.innerHTML = cartItems.map(item => `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>$${item.price}</p>
                    <button onclick="removeFromCart('${item.id}')">Remove from Cart</button>
                </div>
            `).join('');
                }

                app.innerHTML = '<h2>Your Shopping Cart</h2>';
                app.appendChild(cartList);
            })
            .catch(error => console.error('Error:', error));
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

    function addToCart(productId) {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            alert('You must be logged in to add products to the cart');
            return;
        }

        fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-id': sessionId
            },
            body: JSON.stringify({ productId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Product added to cart');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function removeFromCart(productId) {
        fetch('/api/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-id': sessionStorage.getItem('sessionId')
            },
            body: JSON.stringify({ productId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    renderCart();
                }
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
    } else if (window.location.pathname.endsWith('cart.html')) {
        renderCart();
    }
});
