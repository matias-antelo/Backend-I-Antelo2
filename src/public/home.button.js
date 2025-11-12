document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.btn-agregar');

  botones.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id);

      try {
        const response = await fetch('/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });

        if (!response.ok) throw new Error('Error al agregar el producto');
        alert('Producto agregado al carrito');
      } catch (error) {
        console.error(error);
        alert('No se pudo agregar el producto al carrito');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');

  botonesEliminar.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id);

      try {
        const response = await fetch('/carts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });

        if (!response.ok) throw new Error('Error al eliminar el producto');
        alert('Producto eliminado del carrito');
        location.reload(); // actualiza la vista del carrito
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el producto del carrito');
      }
    });
  });
});