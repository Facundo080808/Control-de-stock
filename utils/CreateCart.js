const Post = require("./PostSell");


function CrearCarrito(array,wholSale) {
    console.log("desde el carrito",wholSale);
    
    const cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = '';

    for (const e of array) {
        const precioPorMayor = e.wholPrice ? e.wholPrice : e.price;
        e.totalPrice = wholSale? e.quantity * precioPorMayor : e.quantity * e.price;
        const fila = document.createElement('article');
        fila.classList.add('producto', 'fila', 'd-flex', 'align-items-center', 'p-3', 'mb-2', 'bg-light', 'rounded', 'shadow-sm');

        const name = document.createElement('h5');
        name.textContent = e.name;
        name.classList.add('producto-nombre');
        name.style.flex = '1';
        
        const div = document.createElement('div');
        div.classList.add('cantidad-container', 'd-flex', 'align-items-center');
        
        const lessBtn = document.createElement('button');
        lessBtn.textContent = '-';
        lessBtn.id = e.id+'less'
        lessBtn.classList.add('btn', 'btn-sm', 'btn-secondary', 'me-2');
        
        const cantidad = document.createElement('h5');
        cantidad.textContent = `${e.quantity} x`;
        cantidad.classList.add('cantidad');
        cantidad.style.flex = '1';
        
        const plusBtn = document.createElement('button');
        plusBtn.id = e.id+'plus'
        plusBtn.textContent = '+';
        plusBtn.classList.add('btn', 'btn-sm', 'btn-secondary', 'ms-2');
        
        const precio = document.createElement('h5');
        
        precio.textContent = wholSale ? `$${precioPorMayor}` : `$${e.price}`;
        precio.classList.add('precio');
        precio.style.flex = '1';
        
        const total = document.createElement('h5');
        total.textContent = " = $" +e.totalPrice
        total.classList.add('total');
        total.style.flex = '1';
        
        const delet = document.createElement('button');
        delet.id = e.id+'delete'
        delet.classList.add('bi', 'bi-trash-fill', 'btn', 'btn-danger', 'btn-sm', 'ms-3');
        delet.addEventListener('click', function () {
            // const index = array.findIndex(item => item.id === e.id);
            // if (index !== -1) {
            //     array.splice(index, 1); // Eliminar el producto del array
            //     CrearCarrito(array); // Volver a renderizar el carrito con el array actualizado
            // }
        });
        
        // Incrementar y decrementar cantidad
        plusBtn.addEventListener('click', function () {
            // if (e.quantity === e.stock)return alert(`No hay mas stock para el producto ${e.name}`) 
            // e.quantity++;
            
            // CrearCarrito(array); // Re-renderizar el carrito con la cantidad actualizada


        });
        
        lessBtn.addEventListener('click', function () {
            // if (e.quantity > 1) {
            //     e.quantity--;
            //     CrearCarrito(array); // Re-renderizar el carrito con la cantidad actualizada
            //  //   PrecioTotal()

                
            //}
        });

        div.appendChild(lessBtn);
        div.appendChild(cantidad);
        div.appendChild(plusBtn);

        fila.appendChild(name);
        fila.appendChild(div);
        fila.appendChild(precio);
        fila.appendChild(total);
        fila.appendChild(delet);

        cartBody.appendChild(fila);
    }

    return array

}

module.exports = CrearCarrito;

