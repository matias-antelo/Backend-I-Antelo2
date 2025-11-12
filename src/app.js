import express from 'express'
import ViewRoute from './routes/views.router.js';
import path from 'node:path';
import Handlebars from 'express-handlebars';
import cartsRoute from './routes/carts.routes.js';
import { Server } from 'socket.io';

const app = express()
app.use(express.json());

app.engine('handlebars', Handlebars.engine());
app.set('views', path.join(process.cwd(),'/src/views'))
app.set('view engine', 'handlebars');

app.use(express.static('src/public'));
app.use('/styles', express.static(path.join(process.cwd(), 'src/views/layouts')));
app.use('/',ViewRoute)
app.use('/carts', cartsRoute)

const serverHttp = app.listen(8080, () => {
    console.log(`Server ON`);
})  

const serverSocket = new Server (serverHttp);
serverSocket.on('connection', (socket) => {
console.log('Nueva conección ->', socket.id);

socket.on('nuevoProducto', (producto) => {
    console.log('Producto recibido en el servidor:', producto);
    serverSocket.emit('productoNuevo', producto);       
})})