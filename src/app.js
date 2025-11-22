import express from 'express'
import ViewRoute from './routes/views.router.js';
import path from 'node:path';
import Handlebars from 'express-handlebars';
import cartsRoute from './routes/carts.routes.js';
import { Server } from 'socket.io';
import { readFile, writeFile, productsFile } from './utils/utils.js';
import mongoose from 'mongoose';

const app = express()
app.use(express.json());

//conexion con mongoose
mongoose.connect("mongodb+srv://anteloma87:Anteloma23%23@carrito-compras-cluster.6u5aaig.mongodb.net/?appName=Carrito-compras-cluster")
.then(() => {
  console.log("Conectado a la base de datos MongoDB")
})
.catch(error => {
  console.error("Error al conectar a la base de datos MongoDB:", error)
});

//conexion con handlebars
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
const serverSocket = new Server(serverHttp);

serverSocket.on('connection', async (socket) => {
  console.log('Nueva conexión ->', socket.id);

  let productos = await readFile(productsFile);
  socket.emit('productoNuevo', productos);

  //Agregar producto
  socket.on('nuevoProducto', async (producto) => {
    productos = await readFile(productsFile);
    const id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = { id, ...producto };
    productos.push(nuevoProducto);
    await writeFile(productsFile, productos);
    serverSocket.emit('productoNuevo', productos);
  });

  //Eliminar producto
  socket.on('eliminarProducto', async (id) => {
    let idNum = Number(id);
    productos = await readFile(productsFile);
    const filtrados = productos.filter((p) => p.id !== idNum);
    await writeFile(productsFile, filtrados);
    serverSocket.emit('productoNuevo', filtrados);
  });
});