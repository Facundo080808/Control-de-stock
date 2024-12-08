const { ipcRenderer } = require('electron');
const printer = require('pdf-to-printer')
const raiseServer = require('./utils/levantarServer.js');

document.addEventListener('DOMContentLoaded' , raiseServer);
raiseServer().then(()=>Get())

let arrayOriginal = []
let copiaArray = arrayOriginal;

const DatosToSend = {
    payMethod:'efectivo',
    delivery:false,
    name:'',
    descripcion:'',
    wholPrice:false
}

let productsInCart = [];
const search = document.getElementById('busqueda');
search.addEventListener('keyup', function (e) {
    const value = search.value.toLowerCase();
    copiaArray = arrayOriginal.filter((element) => {
        return element.brand.toLowerCase().includes(value) || 
               element.name.toLowerCase().includes(value) || 
               element.category.toLowerCase().includes(value);
    });
    RenderTable();
    console.log(copiaArray);
});

search.addEventListener('focus', function () {
    copiaArray = arrayOriginal;
});

search.addEventListener('input', function () {
    const value = search.value.toLowerCase();
    if (value === '') {
        copiaArray = arrayOriginal;
        RenderTable();
    }
});
if (arrayOriginal.length === 0) {
    document.getElementById('loading').classList.add('spinner-border','text-warning');}




const tabla = document.getElementById('productosTable').querySelector('tbody');
const section = document.getElementById('CART');
const Totalprice = document.createElement('h2');
Totalprice.classList.add('display-6' ,'fw-bold' ,'text-warning','text-center')


async function Get() {
    try {
            const response = await fetch('http://localhost:4321/products');
        arrayOriginal = await response.json();
        copiaArray = arrayOriginal;
        console.log(copiaArray);
        
        for (const element of arrayOriginal) {
            element.quantity=1;
            element.priceTotal = DatosToSend.wholPrice?element.wholPrice * element.price:element.quantity * element.price;
        }
        if (response.ok) document.getElementById('loading').classList.add('divLoadingoff');
        return RenderTable();
        
    } catch (error) {
        console.error('Error al obtener los productos: ', error);
        setTimeout(Get() , 1000);
    }
    
} 

function RenderTable() {
    
    tabla.innerHTML = '';
    for (const producto of copiaArray) {
        const fila = document.createElement('tr');

        // ////////////////////// 7
        
        const brand = document.createElement('td');
        brand.textContent = producto.brand;
        
        const name = document.createElement('td');
        name.textContent = producto.name;
        
        const category = document.createElement('td');
        category.textContent = producto.category;
        
        const price = document.createElement('td');
        price.textContent = `$${producto.price}`;

        const wholPrice = document.createElement('td');
        wholPrice.textContent = producto.wholPrice? '$'+producto.wholPrice :'Nulo';
        
        const stock = document.createElement('td');
        if (producto.category.toLowerCase() === 'liquido'.toLowerCase()) {
            stock.textContent = producto.stock+' ml';
        }else{

            stock.textContent = producto.stock+'u.';
        }
        
        const btnTd=document.createElement('td');
        btnTd.classList.add('d-flex', 'justify-content-center', 'align-items-center')
        const button= document.createElement('button');
        button.classList.add('bi', 'bi-cart3','btn','btn-primary');
        button.addEventListener('click', ()=>{
            if (producto.stock === 0) return alert('No hay stock disponible de '+producto.name);
            remove();
            const productsInCartSeted = new Set(productsInCart);
        productsInCartSeted.add(producto);
        productsInCart =[...productsInCartSeted]
        console.log(productsInCart);
        updateCart();
        })
        ///////////////////////////
        fila.appendChild(brand);
        fila.appendChild(name);
        fila.appendChild(category);
        fila.appendChild(price);
        fila.appendChild(wholPrice);
        fila.appendChild(stock);
        btnTd.appendChild(button);
        fila.appendChild(btnTd);
        // ///////////////////
        tabla.appendChild(fila);
    };
}

const labelWholprice = document.createElement('label');
const checkWholprice = document.createElement('input');checkWholprice.type ='checkbox';
checkWholprice.addEventListener('change',function () {
        DatosToSend.wholPrice = this.checked;
        updateCart();
        updatePriceTotal();
})
labelWholprice.appendChild(checkWholprice);
labelWholprice.appendChild(document.createTextNode(' Compra por mayor'));

const Sucess = document.createElement('h3');
Sucess.classList.add('display-6','fw-bold','text-success','text-center')
const Print = document.createElement('button');

Print.classList.add('bi','bi-printer-fill','btn','btn-secondary')
const tfoot =document.createElement('footer');
tfoot.classList.add('Tfooter')
const sellButton = document.createElement('button');
function updateCart() {
    
    section.innerHTML = ''; 

    if (productsInCart.length === 0) {
        const h1 = document.createElement('h1');
        h1.innerText = 'Carrito vacío'; 
        section.appendChild(h1); 
    } else {
        
        //aqui se crea la tabla del carrito
        const table = document.createElement('table');
        table.classList.add('tablaDeProductos')
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        
        const th1 = document.createElement('th');
        th1.innerText = 'Productos';
        tr.appendChild(th1);
        
        const th2 = document.createElement('th');
        th2.innerText = 'Cantidad';
        tr.appendChild(th2);

        const th3 = document.createElement('th');
        th3.innerText = 'Total';

        tr.appendChild(th3);

        const th4 = document.createElement('th');
        th4.innerText = 'Quitar';

        tr.appendChild(th4);
        
        thead.appendChild(tr);
        table.appendChild(thead);
        
        // Aqui se agregan productos al array cart
        const tbody = document.createElement('tbody');
        for (const element of productsInCart) {
            const row = document.createElement('tr');

            const cell1 = document.createElement('td');
            cell1.innerText = element.name;
            row.appendChild(cell1);
////////////////////////////////////////////////
            if (element.category === 'liquido'); 
            const cell2 = document.createElement('td');
            const buttonLess = document.createElement('button');
            buttonLess.innerText = '-'
            const buttonMore = document.createElement('button');
            buttonMore.innerText = '+'
            const span = document.createElement('span');
            const cm3 = document.createElement('input');
            cm3.setAttribute('type','number');
            
            const price = document.createElement('span');
            

            buttonLess.classList.add('btn' ,'btn-outline-secondary' ,'btn-sm')
            span.innerText = element.quantity;
            span.classList.add('form-control' ,'text-center')

            buttonMore.classList.add('btn' ,'btn-outline-secondary' ,'btn-sm')
            if (element.category.toLowerCase() !== 'liquido'.toLowerCase()) {
                buttonLess.addEventListener('click',()=>{
                    if (element.quantity === 1) return;
                    element.quantity = element.quantity - 1
                    span.innerText = element.quantity;
                    price.innerText = DatosToSend.wholPrice ?'$'+element.wholPrice * element.quantity:'$'+element.price * element.quantity; 
                    updatePriceTotal();
                    return
                });
                buttonMore.addEventListener('click',()=>{
                    if (element.stock <= element.quantity) return alert(`La cantidad no puede exceder los ${element.stock} ml.`);
                    element.quantity = element.quantity + 1;
                    span.innerText = element.quantity;
                    price.innerText = DatosToSend.wholPrice ?'$'+element.wholPrice * element.quantity:'$'+element.price * element.quantity; 
                    updatePriceTotal();
                    return
                })
                
                cell2.appendChild(buttonLess);
                cell2.appendChild(span);
                cell2.appendChild(buttonMore);
                cell2.classList.add("input-group");
            }else{
                
                buttonLess.addEventListener('click',()=>{
                    if (element.quantity <= 100) {
                        element.quantity = 100;
                        cm3.value = element.quantity;
                        price.innerText = DatosToSend.wholPrice ?'$'+element.wholPrice * element.quantity:'$'+element.price * element.quantity; 
                        updatePriceTotal();
                        return
                    }
                    element.quantity = element.quantity - 100;
                    cm3.value = element.quantity;
                    price.innerText = DatosToSend.wholPrice ?'$'+element.wholPrice * element.quantity:'$'+element.price * element.quantity; 
                    updatePriceTotal();
                    return
                });
                buttonMore.addEventListener('click',()=>{
                    if (element.stock <= element.quantity) return alert(`La cantidad no puede exceder los ${element.stock} ml.`);
                    element.quantity = element.quantity + 100;
                    cm3.value = element.quantity;
                    price.innerText = DatosToSend.wholPrice ?'$'+element.wholPrice * element.quantity:'$'+element.price * element.quantity; 
                    updatePriceTotal();
                    return
                })
               // cm3.style.width = `${cm3.scrollWidth}px`;
                cm3.value = element.quantity = 1000;
                cm3.addEventListener('input',function () {
                    const {value} = cm3;
                    if (value > element.stock) {
                        alert(`La cantidad no puede exceder los ${element.stock} ml.`)
                        
                    }
                    element.quantity = value;
                    price.innerText = DatosToSend.wholPrice ?'$'+element.wholPrice * element.quantity:'$'+element.price * element.quantity; 
                    updatePriceTotal();
                });
                
                cm3.classList.add("labelDeCm");
                cell2.appendChild(buttonLess);
                cell2.appendChild(cm3);
                cell2.appendChild(buttonMore);
                cell2.classList.add("input-group");
            }
            row.appendChild(cell2);
            //////////////////////////////////
            const PRICEPROD = element.wholPrice?element.wholPrice:element.price;
            price.innerText = DatosToSend.wholPrice ?'$  '+PRICEPROD * element.quantity:'$  '+element.price * element.quantity; ;
            const cell3 = document.createElement('td');
            const PRICE =DatosToSend.wholPrice ? element.wholPrice :element.price;
            Totalprice.innerText = productsInCart.length === 1 ?'precio totalo :$'+ PRICE : updatePriceTotal(); 

            const cell4 = document.createElement('td');
            const deleteButton = document.createElement('button');
            
            deleteButton.classList.add('bi','bi-trash-fill','btn','btn-danger');
            deleteButton.addEventListener('click', ()=>{
                if (productsInCart.length === 1)emptyCart(); 
                element.quantity = 1;
                console.log(element);
                
              productsInCart = productsInCart.filter((item)=>item.id !== element.id);
              element.quantity=1
               return updateCart();
            })
            cell3.appendChild(price);
            row.appendChild(cell3);
            
            cell4.appendChild(deleteButton);
            row.appendChild(cell4);

            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        section.appendChild(table);
    }
    
    const nameinputLabel = document.createElement('label');
    const nameinput = document.createElement('input');
    nameinput.classList.add('form-control');
    nameinputLabel.appendChild(nameinput);

    nameinput.type = 'text';
    nameinput.placeholder = 'Nombre del cliente';
    let errorName ;
    nameinput.addEventListener('change', function (params) {
        const value = nameinput.value;
        const regex = /^[A-Za-z\s]+$/;
        if (!regex.test(value)) {
             errorName = document.createElement('span');
            errorName.innerText = 'Solo puedes escribir numeros';
            nameinputLabel.appendChild(errorName);
            return
        }else{
            //console.log(errorName.textContent);
            
           
            errorName && nameinputLabel.removeChild(errorName);
           
            DatosToSend.name = value;
            console.log(DatosToSend);   
        }
    })
    const descriptionLabel = document.createElement('label');
    const description = document.createElement('input');
    description.classList.add('form-control');
    descriptionLabel.appendChild(description)
    description.type = 'text';
    description.placeholder = 'descripcion de la compra';
    
    description.addEventListener('change',function () {
        
        const value = description.value;
        DatosToSend.descripcion = value;
        return
    });
    
    const labelTransfer = document.createElement('label');
    const checkTransfer = document.createElement('input');
    
    checkTransfer.type = 'checkbox';
    
    // Agrega el checkbox y el texto al label de forma correcta
    labelTransfer.appendChild(checkTransfer);
    labelTransfer.appendChild(document.createTextNode(' Compra con transferencia'));
    
    // Escucha el evento 'change' del checkbox
    checkTransfer.addEventListener('change', function() {
      if (this.checked) {
        DatosToSend.payMethod = 'Transferencia';
        console.log(DatosToSend);
        
      } else {
        DatosToSend.payMethod = 'Efectivo';
        console.log(DatosToSend);
      }
    });
    
    // Creación del label y checkbox para "Delivery"
    const labelDelivery = document.createElement('label');
    const checkDelivery = document.createElement('input');
    checkDelivery.type = 'checkbox';
    
    // Agrega el checkbox y el texto al label de forma correcta
    labelDelivery.appendChild(checkDelivery);
    labelDelivery.appendChild(document.createTextNode(' Compra con delivery'));
    
    // Escucha el evento 'change' del checkbox
    checkDelivery.addEventListener('change', function() {
      if (this.checked) {
        DatosToSend.delivery = this.checked;
        console.log(DatosToSend);
      } else {
        DatosToSend.delivery = this.checked;
        console.log(DatosToSend);
      }
    });  


    if (productsInCart.length !== 0) {       
        const article =document.createElement('article');
        article.classList.add('article-form');
        sellButton.addEventListener('click',()=>{
            HandleSubmmit2()
            emptyCart();
        })
        sellButton.classList.add('btn','btn-success','btn-block')
        sellButton.innerText='comprar';
        article.appendChild(labelTransfer);
        article.appendChild(labelDelivery);
        article.appendChild(labelWholprice);
        article.appendChild(nameinputLabel);
        article.appendChild(descriptionLabel);
        
        tfoot.appendChild(Totalprice);
        tfoot.appendChild(sellButton);
        section.appendChild(article);
        section.appendChild(tfoot);
    }
}
updateCart();

const emptyCart = ()=>productsInCart.length = 0;

const updatePriceTotal = ()=>{
    const precioTotal = productsInCart.reduce((total, item) => {
        return total + (item.price * item.quantity); 
    }, 0);
    const porMayor = productsInCart.reduce((total, item) => {
        const product = item.wholPrice? item.wholPrice:item.price;
        return total + (product * item.quantity); 
    }, 0);
    if (DatosToSend.wholPrice) {
        return Totalprice.innerText = 'precio total por mayor: $'+ porMayor;
    }else{
        return Totalprice.innerText = 'precio total: $'+ precioTotal;   
    }
}
updatePriceTotal();
let data ;
async function HandleSubmmit2() {
    let comprar = true;
    let priceAndQuantity = productsInCart.map((element)=>{
        return {
            id:element.id,
            quantity:element.quantity
        }
    }); 
    //emptyCart();
    
   // console.log(priceAndQuantity);
    
        const response = comprar && await fetch('http://localhost:4321/orders/', {
            method:'POST',
            headers: {
                    'Content-Type': 'application/json'},
            body:JSON.stringify({  
                clientName:DatosToSend.name,
                description:DatosToSend.descripcion,
                delivery:DatosToSend.delivery,
                payMethod:DatosToSend.payMethod,
               
                productId : productsInCart.map((element)=>{
                    return {
                        id:element.id,
                        quantity:element.quantity
                    }
                }),
                wholPrice:DatosToSend.wholPrice
            })
            
        })
        if (response.ok) {
           // comprar = false;
            emptyCart();
             data = await response.json();
            console.log(data);
            
            Sucess.textContent='Venta creada con exito!!';

            tfoot.appendChild(Sucess);
            tfoot.appendChild(Print); 
            return
        } else {
           alert('error al crear la compra') 
        }
    
}

function remove() {
    if (Sucess && tfoot.contains(Sucess)) {
        Sucess.textContent = '';
        tfoot.removeChild(Sucess);
    }
    if (Print && tfoot.contains(Print)) {
        tfoot.removeChild(Print);
    }
    return
}
// Agregar el evento al botón para generar y luego imprimir el ticket

// Agregar el evento al botón
Print.addEventListener('click', async function () {
    try {
        const filePath = await ipcRenderer.invoke('crearticket', data); // Invocar el manejador
        console.log('PDF generado en:', filePath);

        // Imprimir el archivo PDF
        await printer.print(filePath, { printer: 'EPSON L3110 Series',silent:true });
        console.log('Impresión exitosa');
        emptyCart();
        updateCart();
      return await Get()
        

    } catch (err) {
        console.error('Error al generar o imprimir el ticket:', err);
    }
});


module.exports = {copiaArray, arrayOriginal, RenderTable}






















