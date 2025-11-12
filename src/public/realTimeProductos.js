document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const form = document.getElementById('form-producto');
  const contenedor = document.getElementById('contenedor-productos');

  const renderProductos = (productos) => {
    contenedor.innerHTML = productos.map((p) => `
      <div id="producto-${p.id}" class="grilla">
        <div class="grilla-izquierda">
          <img src="/foto/producto.png" alt="Imagen producto" class="imagen-producto">
        </div>
        <div class="separador"></div>
        <div class="contenido">
          <p><strong>Nombre:</strong> ${p.title}</p>
          <p><strong>Precio:</strong> $${p.price}</p>
          <p><strong>Descripción:</strong> ${p.description}</p>
          <p><strong>Stock:</strong> ${p.stock}</p>
          <p><strong>Categoría:</strong> ${p.category}</p>
          <button class="btn-eliminar" data-id="${p.id}">Eliminar Producto</button>
        </div>
      </div>
    `).join('');

    agregarListenersEliminar();
  };

  // Envia nuevo producto al servidor
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const producto = {
      title: document.getElementById('title').value,
      price: parseFloat(document.getElementById('price').value),
      description: document.getElementById('description').value,
      stock: parseInt(document.getElementById('stock').value),
      category: document.getElementById('category').value,
    };
    socket.emit('nuevoProducto', producto);
    form.reset();
  });

  socket.on('productoNuevo', (productos) => {
    renderProductos(productos);
  });

  // Eliminar producto
  const agregarListenersEliminar = () => {
    document.querySelectorAll('.btn-eliminar').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        socket.emit('eliminarProducto', id);
      });
    });
  };
});

