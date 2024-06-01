document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const cart = [];

    // Render login form
    function renderLoginForm() {
        app.innerHTML = `
            <h2>User Login</h2>
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

    function renderLoginAdminForm() {
        app.innerHTML = `
        <h2>Admin Login</h2>
        <form id="login-admin-form">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    `;
        document.getElementById('login-admin-form').addEventListener('submit', loginAdmin);
    }

    function renderUserTypeForm() {
        app.innerHTML = `
        <h2>Choose Your Role</h2>
        <div class="role-selection">
            <button id="admin-button">Administrator</button>
            <button id="customer-button">Customer</button>
        </div>
    `;
        document.getElementById('admin-button').addEventListener('click', () => {
            window.location.href = 'login_admin.html';
        });
        document.getElementById('customer-button').addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    function renderStore(role) {
        fetch('/products')
            .then(response => response.json())
            .then(products => renderProductList(products));

        const role = sessionStorage.getItem('role'); // Obtener el rol desde sessionStorage

        if (role === 'admin') {
            const adminButton = document.createElement('button');
            adminButton.textContent = 'Agregar Producto';
            adminButton.onclick = () => {
                window.location.href = '/add_product.html';
            };

            const cartButtonContainer = document.getElementById('admin-cart-buttons');
            if (cartButtonContainer) {
                cartButtonContainer.appendChild(adminButton);
            } else {
                const newCartButtonContainer = document.createElement('div');
                newCartButtonContainer.id = 'admin-cart-buttons';
                newCartButtonContainer.appendChild(adminButton);
                app.appendChild(newCartButtonContainer);
            }
        }
    }



    function addProduct(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;

        console.log('Sending product data to server:', { name, description, price });

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-id': sessionStorage.getItem('sessionId')
            },
            body: JSON.stringify({ name, description, price })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Product added successfully:', response);
                    return response.json();
                } else {
                    console.error('Failed to add product:', response.statusText);
                    throw new Error('Failed to add product');
                }
            })
            .then(product => {
                alert(`Product added successfully:\nName: ${product.name}\nDescription: ${product.description}\nPrice: ${product.price}`);
                window.location.href = '/store.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add product');
            });
    }

// Add the event listener to the form
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', addProduct);
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
                    sessionStorage.setItem('role', data.role); // Guardar el rol en sessionStorage
                    alert('Login successful');
                    window.location.href = 'store.html'; // Redirigir a la tienda después del login
                } else {
                    alert('Login failed');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function loginAdmin(event) {
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
                    window.location.href = 'add_product.html'; // Redirige a add_product.html después del inicio de sesión exitoso
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
        const role = event.target.role.value;

        fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-id': sessionStorage.getItem('sessionId')
            },
            body: JSON.stringify({ username, password, role })
        })
            .then(response => response.text())
            .then(data => {
                alert('Registration successful');
                window.location.href = 'user_type.html'; // Redirigir a la página de selección de tipo de usuario después del registro
            })
            .catch(error => console.error('Error:', error));
    }


    // Render product list
    function renderProductList(products, role) {
        app.innerHTML = `
        <h2>Products</h2>
        <div class="product-list">
            ${products.map(product => `
                <div class="product-item">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                    ${role === 'admin' ? `<button onclick="deleteProduct(${product.id})">Delete</button>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    }

    // Delete product function
    function deleteProduct(productId) {
        // Make a DELETE request to the server
        fetch(`/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'session-id': sessionStorage.getItem('sessionId')
            }
        })
            .then(response => {
                if (response.ok) {
                    // If the product was successfully deleted, re-render the product list
                    fetch('/products')
                        .then(response => response.json())
                        .then(products => renderProductList(products, sessionStorage.getItem('role')));
                } else {
                    console.error('Failed to delete product');
                }
            });
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
    } else if (window.location.pathname.endsWith('login_admin.html')) {
        renderLoginAdminForm();
    } else if (window.location.pathname.endsWith('user_type.html')) {
        renderUserTypeForm();
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

    document.addEventListener('DOMContentLoaded', () => {
        const adminButton = document.getElementById('admin-button');
        const customerButton = document.getElementById('customer-button');

        adminButton.addEventListener('click', () => {
            window.location.href = 'login_admin.html'; // Redirige a la página de inicio de sesión del administrador
        });

        customerButton.addEventListener('click', () => {
            window.location.href = 'login.html'; // Redirige a la página de inicio de sesión del cliente
        });
    });
});
