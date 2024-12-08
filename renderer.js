const Get = require("./utils/GetProducts");
const WholClient = require("./utils/getWholClients");
const raiseServer = require("./utils/levantarServer");
const crearTablaProductos = require("./utils/crear_tablas");
//const CrearCarrito = require("./utils/CreateCart");
const Post = require("./utils/PostSell");
const WholclientsCreate = require("./utils/crearWholClients");
const { ipcRenderer } = require("electron");



const DatosToSend = {
    name:"",
    delivery:false,
    payMethod:"Efectivo",
    employee:"",
    wholSale:false
}   

let productos = []
let copiaOriginal = productos
let productsInCart = []
let Clients = []
let CopiaClients = []
raiseServer().then(()=>WholClient()).then((response)=>{CopiaClients = Clients = response;WholclientsCreate(response);return Get()}).then((response)=> {productos = response;copiaOriginal = [...response]}).then(()=>crearTablaProductos(productos,productsInCart)).then((response)=>{
for (const element of response) {
    const btn = document.getElementById(element.id+'toAdd')
    btn.addEventListener('click',function () {
        console.log('ola',element.name);
        
            if (element.stock <= 0) return alert('No hay stock disponible de '+element.name);
            const productsInCartSeted = new Set(productsInCart);
            element.quantity = 1
            element.totalPrice = element.quantity * element.price
        productsInCartSeted.add(element);
        productsInCart =[...productsInCartSeted]
        CrearCarrito(productsInCart,DatosToSend.wholSale)
        console.log(productsInCart);
        TotalPriceTag.textContent = calculateTotalPrice()
        })
    }
}
).catch(console.error)

//////////////////////////////////////////////////////////

function CrearCarrito() {
    console.log("desde el carrito",DatosToSend.wholSale);
    
    const cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = '';

    for (const e of productsInCart) {
        const precioPorMayor = e.wholPrice ? e.wholPrice : e.price;
        e.totalPrice = DatosToSend.wholSale? e.quantity * precioPorMayor : e.quantity * e.price;
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
        
        
        const plusBtn = document.createElement('button');
        plusBtn.id = e.id+'plus'
        plusBtn.textContent = '+';
        plusBtn.classList.add('btn', 'btn-sm', 'btn-secondary', 'ms-2');
        
        const precio = document.createElement('h5');
        
        precio.textContent = DatosToSend.wholSale ? `$${precioPorMayor}` : `$${e.price}`;
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
            const index = productsInCart.findIndex(item => item.id === e.id);
            if (index !== -1) {
                productsInCart.splice(index, 1); // Eliminar el producto del array
                CrearCarrito(); // Volver a renderizar el carrito con el array actualizado
            }
        });
        if (e.category.toLowerCase() === 'liquido'.toLowerCase()) {
                e.quantity = 1000;
                e.totalPrice = DatosToSend.wholSale? e.quantity * precioPorMayor : e.quantity * e.price;
                total.textContent = " = $" +e.totalPrice
            const milimetros = document.createElement('input')
            milimetros.id = 'inputDeVolumen'
            milimetros.value = e.quantity = 1000;
                milimetros.addEventListener('input',function () {
                    const {value} = milimetros;
                    if (value > e.stock) {
                        CrearCarrito()
                        return
                    }
                    e.quantity = value;
                    e.totalPrice = DatosToSend.wholSale? e.quantity * precioPorMayor : e.quantity * e.price;
                    total.textContent = " = $" +e.totalPrice
                    TotalPriceTag.textContent = calculateTotalPrice()
                });
                
                // milimetros.addEventListener('keyup', function (event) {
                //     if (event.key === 'Enter') {
                //         if (milimetros.value > e.stock) {
                //             alert(`La cantidad no puede exceder los ${e.stock} ml.`);
                //             milimetros.value = e.quantity; 
                //             e.quantity = e.stock; 
                //             milimetros.focus()
                //             milimetros.select()
                //         } else {
                //             e.quantity = Number(milimetros.value);
                //         }
                
                //         e.totalPrice = DatosToSend.wholSale
                //             ? e.quantity * precioPorMayor
                //             : e.quantity * e.price;
                
                //         CrearCarrito();
                //     }
                // });
                
            // plusBtn.addEventListener('click',function (){
            //     if (milimetros.value > e.stock) {
            //         return alert(`La cantidad no puede exceder los ${e.stock} ml.`)
            //     }
            //     e.quantity += 1000
            //     //CrearCarrito();
            //     milimetros.value = e.quantity
            //     TotalPriceTag.textContent = calculateTotalPrice()
            // })
            // lessBtn.addEventListener('click',function () {
            //     e.quantity -= 1000
            //     CrearCarrito();
            //     if (e.quantity <= 1000 ){
            //         e.quantity = 1000
            //         milimetros.value = e.quantity
            //         return
            //     }
            //     milimetros.value = e.quantity
            //     TotalPriceTag.textContent = calculateTotalPrice()
            // })
            //div.appendChild(lessBtn);
            div.appendChild(milimetros);
           // div.appendChild(plusBtn);

            div.classList.add("labelDeCm");
            div.classList.add("input-group")
        }
        else{
        const cantidad = document.createElement('h5');
        cantidad.textContent = `${e.quantity} x`;
        cantidad.classList.add('cantidad');
        cantidad.style.flex = '1';
        // Incrementar y decrementar cantidad
        plusBtn.addEventListener('click', function () {
            if (e.quantity === e.stock)return alert(`No hay mas stock para el producto ${e.name}`) 
            e.quantity++;
            CrearCarrito(); // Re-renderizar el carrito con la cantidad actualizada
            TotalPriceTag.textContent = calculateTotalPrice()
        });
        
        lessBtn.addEventListener('click', function () {
            if (e.quantity > 1) {
                e.quantity--;
                CrearCarrito(); // Re-renderizar el carrito con la cantidad actualizada
                TotalPriceTag.textContent = calculateTotalPrice()
            }
        });

        div.appendChild(lessBtn);
        div.appendChild(cantidad);
        div.appendChild(plusBtn);
    }

        fila.appendChild(name);
        fila.appendChild(div);
        fila.appendChild(precio);
        fila.appendChild(total);
        fila.appendChild(delet);

        cartBody.appendChild(fila);
    }
}
////////////////////////////

const searchClient = document.getElementById('buscarCliente');
searchClient.addEventListener('keyup', function (e) {
    
    const value = searchClient.value.toLowerCase();
    Clients = CopiaClients.filter((element) => {
        return (element.clientName.toLowerCase().includes(value))
    });
    WholclientsCreate(Clients); 
});

searchClient.addEventListener('focus', function () {
    Clients = CopiaClients;
    WholclientsCreate(Clients); 
});

searchClient.addEventListener('input', function () {
    const value = search.value.toLowerCase();
    if (value === '') {
        Clients = [...CopiaClients];
        WholclientsCreate(Clients); 
    }
});
///////////////////////////
const search = document.getElementById('busqueda');
search.addEventListener('keyup', function (e) {
    const value = search.value.toLowerCase();
    productos = copiaOriginal.filter((element) => {
        return (element.brand.toLowerCase().includes(value) || 
               element.name.toLowerCase().includes(value) || 
               element.category.toLowerCase().includes(value))
    });
    crearTablaProductos(productos,productsInCart); 
});

search.addEventListener('focus', function () {
    productos = copiaOriginal;
    crearTablaProductos(productos,productsInCart)
});

search.addEventListener('input', function () {
    const value = search.value.toLowerCase();
    if (value === '') {
        productos = [...copiaOriginal];
        crearTablaProductos(productos,productsInCart)
    }
});
const comprar = document.getElementById('COMPRAR')
const Mayor = document.getElementById('mayorista')
const Delivery = document.getElementById('delivery')
const transferencia = document.getElementById('transferencia')
const TotalPriceTag = document.getElementById('totalPrice')
const Name = document.getElementById('nombre')
const Employee = document.getElementById('EMPLOYEE')

Employee.addEventListener("input", function () {
DatosToSend.employee = Employee.value;
console.log("Nombre actualizado:", DatosToSend.employee);
});

// Escuchadores de eventos para guardar los valores en DatosToSend
Name.addEventListener("input", function () {
DatosToSend.name = Name.value;
console.log(Name.value);

console.log("Nombre actualizado:", DatosToSend.name);
});

Mayor.addEventListener("change", function () {
    console.log(productsInCart);

    DatosToSend.wholSale = Mayor.checked;

    CrearCarrito(productsInCart, DatosToSend.wholSale);
    TotalPriceTag.textContent = calculateTotalPrice(productsInCart);
    console.log("Mayorista actualizado:", DatosToSend.wholSale);
});

Delivery.addEventListener("change", function () {
DatosToSend.delivery = Delivery.checked;
console.log("Delivery actualizado:", DatosToSend.delivery);
});

transferencia.addEventListener("change", function () {
if (transferencia.checked) {
    DatosToSend.payMethod = "Transferencia";
} else {
    DatosToSend.payMethod = "Efectivo";
}
console.log("Método de pago actualizado:", DatosToSend.payMethod);
});

comprar.addEventListener("click", async function () {
    
if (productsInCart.length === 0) return alert('El carrito esta vacio')
   
    const response =await Post(productsInCart,DatosToSend)
    if (response) {
        Get().then((response)=>crearTablaProductos(response)).then((response)=>{
            for (const element of response) {
                const btn = document.getElementById(element.id+'toAdd')
                btn.addEventListener('click',function () {
                    console.log('ola',element.name);
                    
                        if (element.stock <= 0) return alert('No hay stock disponible de '+element.name);
                        const productsInCartSeted = new Set(productsInCart);
                        element.quantity = 1
                        element.totalPrice = element.quantity * element.price
                    productsInCartSeted.add(element);
                    productsInCart =[...productsInCartSeted]
                    CrearCarrito(productsInCart,DatosToSend.wholSale)
                    console.log(productsInCart);
                    TotalPriceTag.textContent = calculateTotalPrice()
                    })
                }
            }
            ).catch(console.error)
    }
    const printer = await ipcRenderer.invoke('printticket',response)
    console.log(printer); 
});

function calculateTotalPrice() {
    console.log('calculando precio total');
    
    return productsInCart.reduce((total, product) => {
        return total + parseFloat(product.totalPrice);
    }, 0);
}



