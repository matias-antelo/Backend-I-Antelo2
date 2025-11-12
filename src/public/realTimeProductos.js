document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); //establece la conexión con el servidor

    const form = document.getElementById('form-producto');
    form.addEventListener('submit', () => {

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
});

