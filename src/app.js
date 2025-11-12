import express from 'express'
import ViewRoute from './routes/views.router.js';
import path from 'node:path';
import Handlebars from 'express-handlebars';
import cartsRoute from './routes/carts.routes.js';
import { Server } from 'socket.io';
import { readFile, writeFile, productsFile } from './utils/utils.js';

const app = express()
app.use(express.json());

app.engine('handlebars', Handlebars.engine());
app.set('views', path.join(process.cwd(), '/src/views'))
app.set('view engine', 'handlebars');

app.use(express.static('src/public'));
app.use('/styles', express.static(path.join(process.cwd(), 'src/views/layouts')));
app.use('/', ViewRoute)
app.use('/carts', cartsRoute)

const serverHttp = app.listen(8080, () => {
    console.log(`Server ON`);
})

/*let BBDD = [];

const serverSocket = new Server(serverHttp);

serverSocket.on('connection', (socket) => {
    console.log('Nueva conección ->', socket.id);
    socket.emit('productoNuevo', BBDD);
    
    socket.on('nuevoProducto', (producto) => {
        const id = BBDD.length > 0 ? BBDD[BBDD.length - 1].id + 1 : 1;
        const nuevoProducto = { id, ...producto };
        BBDD.push(nuevoProducto);
        serverSocket.emit('productoNuevo', BBDD);
        console.log('Producto agregado:', nuevoProducto);
    });
    socket.on('eliminarProducto', (id) => {
        const idNum = Number(id);
        BBDD = BBDD.filter((p) => p.id !== idNum);
        serverSocket.emit('productoNuevo', BBDD);
        console.log('Producto eliminado:', BBDD);
    });
})*/

const serverSocket = new Server(serverHttp);

// 🔥 WebSockets
serverSocket.on('connection', async (socket) => {
  console.log('Nueva conexión ->', socket.id);

  // Leer productos actuales desde products.json
  let productos = await readFile(productsFile);
  socket.emit('productoNuevo', productos);

  // 🟢 Agregar producto
  socket.on('nuevoProducto', async (producto) => {
    // Leer la base actualizada
    productos = await readFile(productsFile);

    const id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = { id, ...producto };

    productos.push(nuevoProducto);
    await writeFile(productsFile, productos); // Guardar en disco

    // Emitir lista actualizada a todos los clientes
    serverSocket.emit('productoNuevo', productos);

    console.log('✅ Producto agregado:', nuevoProducto);
  });

  // 🔴 Eliminar producto
  socket.on('eliminarProducto', async (id) => {
    let idNum = Number(id);

    productos = await readFile(productsFile);
    const filtrados = productos.filter((p) => p.id !== idNum);

    await writeFile(productsFile, filtrados); // Guardar cambios

    serverSocket.emit('productoNuevo', filtrados);

    console.log(`🗑️ Producto con id ${idNum} eliminado`);
  });
});