# Online Store Application

## Nombres

#### Alejandro Castro - A00372470
#### Carlos Felipe Sánchez - A00404134
#### Cristian Molina - A00404853

## Descripción

Esta es una aplicación de tienda en línea que permite a los usuarios navegar productos, agregarlos al carrito, ver el carrito y proceder al pago. Los administradores pueden agregar y eliminar productos de la tienda. La aplicación utiliza un servidor Node.js para gestionar las solicitudes y respuestas.

## Requisitos

- Node.js (v12 o superior)
- npm (v6 o superior)

## Instalación

1. Clona el repositorio a tu máquina local:

   ```bash
   git clone https://github.com/AIejoCastro/StoreWebSite.git

2. Navega al directorio del proyecto:

   ```bash
   cd StoreWebSite

3. Instala las dependencias necesarias:

   ```bash
   npm install

## Uso

1. Para iniciar el servidor de la aplicación, usa el siguiente comando:

   ```bash
   node server/app.js

El servidor se iniciará y estará escuchando en el puerto especificado (por defecto 3000). Puedes acceder a la aplicación navegando a http://localhost:3000/login.html en tu navegador web.

## Funcionalidades

### Navegar productos
- Los usuarios pueden ver la lista de productos disponibles en la tienda.
- Los administradores pueden agregar y eliminar productos.

### Agregar al carrito
- Los usuarios pueden agregar productos al carrito de compras.
- Es necesario iniciar sesión para agregar productos al carrito.

### Ver el carrito
- Los usuarios pueden ver los productos agregados al carrito, modificar la cantidad y eliminar productos del carrito.

### Proceder al pago
- Los usuarios pueden proceder al pago de los productos en el carrito.
- Al completar el pago, los productos se eliminan del carrito y el usuario es redirigido a la página principal de la tienda.

## Estructura del proyecto

1. Estructura

   ```bash
   online-store/
   │
   ├── public/
   │   ├── css/
   │   │   └── menu.css
   │   ├── js/
   │   │   └── script.js
   │   └── index.html
   │
   ├── server/
   │   ├── app.js
   │   └── api/
   │       ├── cart.js
   │       ├── products.js
   │       └── users.js
   │
   ├── package.json
   └── README.md

## Archivos Clave
- public/index.html: Página principal de la tienda.
- public/js/script.js: Contiene la lógica del cliente para manejar el carrito y el proceso de pago.
- server/app.js: Archivo principal del servidor, configura y ejecuta el servidor Node.js.
- server/api/cart.js: Maneja las operaciones relacionadas con el carrito.
- server/api/products.js: Maneja las operaciones relacionadas con los productos.
- server/api/users.js: Maneja las operaciones relacionadas con los usuarios.

## API Endpoints
- GET /api/products: Obtiene la lista de productos disponibles.
- POST /api/cart/add: Agrega un producto al carrito.
- POST /api/cart/remove: Elimina un producto del carrito.
- POST /api/cart/clear: Vacía el carrito.
- GET /api/cart: Obtiene los productos en el carrito.
- DELETE /api/products/:id: Elimina un producto (solo para administradores).