const UploadProducts = require("../../back/src/utils/uploadProducts.js");
const UploadOrders = require('../../back/src/utils/uploadOrders.js');
const server = require("../../back/src/app.js");
const con = require("../../back/src/db.js");
const { conn } = con;

conn.sync({ force: false }).then(() => {
    server.listen(4321, () => {
       // UploadProducts();
       // UploadOrders();
        console.log('Server running at http://localhost:4321/');
    });
}); 
document.addEventListener('DOMContentLoaded',GetOrders());
const footer = document.getElementById('footer');
let Ordenes = [];
let OrdenesCopia = [];
const FilterSelect = document.getElementById('Filter');
if (OrdenesCopia.length === 0) document.getElementById('loading').classList.add('spinner-border','text-warning');

async function GetOrders() {
    try {
        const response = await fetch(`http://localhost:4321/orders/`);
        if (response.ok) {

            const data = await response.json();
            Ordenes = data;
            OrdenesCopia = Ordenes;
            footer.classList.add('footernone')
            renderOrders(); }
    } catch (error) {
        console.error('error');
        setTimeout(GetOrders(), 1000);
    }
}

async function GetByDate(selectedDate) {
try {
    const response = await fetch(`http://localhost:4321/orders/filter/date/${selectedDate}`)
    const data = await response.json();
    Ordenes = data;
    OrdenesCopia = Ordenes;
    renderOrders(); 
} catch (error) {
    console.error('error');
}
}

document.getElementById('submitButton').addEventListener('click', function() {
    const selectedDate = document.getElementById('dateInput').value; 
    GetByDate(selectedDate);
    FilterSelect.value = 'todas';
    footer.classList.remove('footernone')
    footer.classList.add('bg-dark', 'text-white');
});
const btn2 = document.getElementById('buton');
btn2.addEventListener('click', function () {
    Yesterday();
    FilterSelect.value = 'todas';
    footer.classList.remove('footernone')
    footer.classList.add('bg-dark', 'text-white');
});


const btnCalcular = document.getElementById('calcular');
btnCalcular.addEventListener('click',function () {
    const resultado = OrdenesCopia.reduce((a, b) => a + parseFloat(b.totalAmount), 0);
            h2.textContent = 'Precio total de las ordenes :'+resultado+'$';
})
function renderOrders() {
    const tablaBody = document.getElementById('ordenes');
    tablaBody.innerHTML = ''; 
    document.getElementById('loading').style='display:none;'
    for (const element of OrdenesCopia) {
        const fila = document.createElement('tr');
        
        const employee = document.createElement('td')
        employee.textContent = element.employee
        fila.appendChild(employee);

        const client = document.createElement('td');
        client.textContent = element.clientName || !element.clientName && 'nulo'
        fila.appendChild(client);
        
        
        const date = document.createElement('td');
        const createdAt = new Date(element.createdAt);
        date.textContent = createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString();
        fila.appendChild(date);
        
        
        const payMethod = document.createElement('td');
        payMethod.textContent = element.payMethod;
        fila.appendChild(payMethod);
        
        
        const whol = document.createElement('td');
        whol.textContent = element.wholSale ? 'Sí' : 'No';
        fila.appendChild(whol);
        
        
        const delivery = document.createElement('td');
        delivery.textContent = element.delivery ? 'Sí' : 'No';
        fila.appendChild(delivery);
        
        
        const products = document.createElement('td');
        products.classList.add('d-flex', 'flex-column');
        const productDetails = element.itemorders.map(item => {
            const productSale = document.createElement('span');
            productSale.textContent = `${item.quantity}x ${item.product.name} ($${item.unitPrice}).`;
            products.appendChild(productSale);
        })
        //products.textContent = productDetails;
        fila.appendChild(products);
        
        // Columna para el total
        const totalAmount = document.createElement('td');
        totalAmount.textContent = `$${element.totalAmount}`;
        fila.appendChild(totalAmount);
        
        // Añadir la fila a la tabla
        tablaBody.appendChild(fila);
    }
}
const btndefect = document.getElementById('defecto');
btndefect.addEventListener('click',function () {
    footer.classList.add('footernone')
    FilterSelect.value = 'todas';
    return GetOrders();
})
const h2 = document.getElementById('TOTAL');

async function Yesterday() {
    const response = await fetch(`http://localhost:4321/orders/filter/yesterday`);
    const data = await response.json();
    Ordenes = data;
    OrdenesCopia = Ordenes;
    
    h2.textContent = '';
    renderOrders(); 
}

FilterSelect.addEventListener('change',function () {
    if (FilterSelect.selectedIndex === 0) {
        OrdenesCopia = Ordenes;
        //const resultado = OrdenesCopia.reduce((a, b) => a + parseFloat(b.totalAmount), 0);
        h2.textContent = '';
        renderOrders()
    }
    else if (FilterSelect.selectedIndex === 1) {
        h2.textContent = '';
        const dato = 'Transferencia';
        OrdenesCopia = Ordenes.filter((element)=>element.payMethod.toLowerCase() === dato.toLowerCase());
        
        h2.textContent = '';
        renderOrders()

    }else if (FilterSelect.selectedIndex === 2) {
        h2.textContent = '';
        const dato = 'efectivo';
        OrdenesCopia = Ordenes.filter((element)=>element.payMethod.toLowerCase() === dato.toLowerCase());
        //const resultado = OrdenesCopia.reduce((a, b) => a + parseFloat(b.totalAmount), 0);
        h2.textContent = '';
        renderOrders()
    }else if (FilterSelect.selectedIndex === 3) {
        h2.textContent = '';
        OrdenesCopia = Ordenes.filter((element)=>element.delivery === true);
        //const resultado = OrdenesCopia.reduce((a, b) => a + parseFloat(b.totalAmount), 0);
        h2.textContent = '';
        renderOrders()
    }else if (FilterSelect.selectedIndex === 4) {
        h2.textContent = '';
        OrdenesCopia = Ordenes.filter((element)=>element.wholSale === true);
        //const resultado = OrdenesCopia.reduce((a, b) => a + parseFloat(b.totalAmount), 0);
        h2.textContent = '';
        renderOrders()
    }
    console.log(OrdenesCopia);
    
});

FilterSelect.addEventListener('focus', function () {
    OrdenesCopia = Ordenes;
    console.log(OrdenesCopia);
})
/**FilterSelect.addEventListener('blur',function () {
    OrdenesCopia = Ordenes;
    console.log(OrdenesCopia);
}) */

    