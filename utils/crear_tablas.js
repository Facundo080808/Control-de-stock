const CrearCarrito = require("./CreateCart");

async function crearTablaProductos(array) {
    document.getElementById('loading').style.display='block'
    const tablaBody = document.getElementById('productosBody');
    tablaBody.innerHTML = '';
    for (const e of array) {
        const fila = document.createElement('tr')

        const brand = document.createElement('td')
        brand.textContent = e.brand

        const name = document.createElement('td')
        name.textContent = e.name

        const category = document.createElement('td')
        category.textContent = e.category

        const price = document.createElement('td');
        price.textContent = `$${e.price}`;

        const wholPrice = document.createElement('td');
        wholPrice.textContent = e.wholPrice? '$'+e.wholPrice :'Nulo';
        
        const stock = document.createElement('td');
        if (e.category.toLowerCase() === 'liquido'.toLowerCase()) {
            stock.textContent = e.stock+' ml';
        }else{
            stock.textContent = e.stock+'u.';
        }

        const btnTd=document.createElement('td');
        btnTd.classList.add('d-flex', 'justify-content-center', 'align-items-center')
        const button= document.createElement('button');
        button.id = e.id+'toAdd';
        button.classList.add('bi', 'bi-cart3','btn','btn-primary');

        fila.appendChild(brand);
        fila.appendChild(name);
        fila.appendChild(category);
        fila.appendChild(price);
        fila.appendChild(wholPrice);
        fila.appendChild(stock);
        btnTd.appendChild(button);
        fila.appendChild(btnTd);
        tablaBody.appendChild(fila);
        
    }
    document.getElementById('loading').style.display='none'
    return array
}

module.exports = crearTablaProductos;
