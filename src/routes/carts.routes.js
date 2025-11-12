import {Router} from 'express';
import { readFile, writeFile, productsFile, cartsFile } from '../utils/utils.js';

const route = Router();

route.post('/', async (req, res) => {
  try {
    const { id } = req.body; // id del producto enviado desde el botón
    const products = await readFile(productsFile);
    const carts = await readFile(cartsFile);

    const product = products.find(p => p.id === id);
    
    carts.push(product);
    await writeFile(cartsFile, carts);

    res.status(200).json({ message: 'Producto agregado al carrito', product });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

route.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const carts = await readFile(cartsFile);
    const index = carts.findIndex(p => p.id === id);
    carts.splice(index, 1);
    await writeFile(cartsFile, carts);
    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default route;  