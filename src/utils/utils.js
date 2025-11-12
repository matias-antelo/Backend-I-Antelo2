import fs from 'fs';
import path from 'node:path';

// Archivos para persistencia de la informacion
const productsFile = path.resolve('src/data/products.json');
const cartsFile = path.resolve('src/data/carts.json');

// Funciones de lectura y escritura de archivos
const readFile = async (path) => {
  try {
    if (!fs.existsSync(path)) return [];
    const data = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer archivo:', error);
  }
};

const writeFile = async (path, data) => {
  try {
    await fs.promises.writeFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error al escribir archivo:', error);
  }
};

export { readFile, writeFile, productsFile, cartsFile };