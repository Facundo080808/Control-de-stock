const  UploadProducts = require("../../back/src/utils/uploadProducts.js");
const uploadOrders = require('../../back/src/utils/uploadOrders.js')
const server =require( "../../back/src/app.js");
const con =require("../../back/src/db.js");
const raiseServer = require("../../utils/levantarServer.js");
const { conn } = con;

/**conn.sync({ force: false }).then(() => {
server.listen(4321, () => {
    //UploadProducts();
    //uploadOrders();
    console.log('Server running at http://localhost:4321/');
});
});  */
raiseServer()
/////////////crear
const title =document.getElementById('titulo'); 

const nombre = document.getElementById('nombre');

const marca = document.getElementById('marca');
const categoria = document.getElementById('categoria');
const precio = document.getElementById('precio');
const precioPorMayor = document.getElementById('pormayor');
const disponibles = document.getElementById('stock');
//const hacerbtn = document.getElementById('hacer');
const articleBtn = document.getElementById('articleBtn');


const DataToCreate = {
    nombre : '',
    marca : '',
    categoria:'',
    precio:0,
    porMayor:0,
    stock:0
}
let productos = [];
if (productos.length === 0) {
    document.getElementById('loading').classList.add('spinner-border','text-warning');}
async function GetProducts() {
    try {
        const response = await fetch('http://localhost:4321/products');
        productos = await response.json();
        if (response.ok) document.getElementById('loading').classList.add('divLoadingoff');
        return Print();
    } catch (error) {
        console.error(error);
        setTimeout(GetProducts(), 1000);
    }
}GetProducts();


const tabla = document.getElementById('productosTable').querySelector('tbody');
function Print() {
    try {
        
        ////////////////////////////////////////

        tabla.innerHTML = '';

        productos.forEach(producto => {
            const DataToEdit = {
                nombre : producto.name,
                marca : producto.brand,
                categoria:producto.category,
                precio:producto.price,
                porMayor:producto.wholPrice,
                stock:producto.stock
            }
            const fila = document.createElement('tr');

            // ////////////////////// 
            const codeBar = document.createElement('td');
            codeBar.textContent = producto.codeBar;

            const brand = document.createElement('td');
            brand.textContent = producto.brand;

            const name = document.createElement('td');
            name.textContent = producto.name;

            const category = document.createElement('td');
            category.textContent = producto.category;

            const price = document.createElement('td');
            price.textContent = `$${producto.price}`;

            const wholPrice = document.createElement('td');
            
            wholPrice.textContent = producto.wholPrice?`$${producto.wholPrice}`:`nulo`;
            const stock = document.createElement('td');
            if (producto.category.toLowerCase().includes('liquido')) {
                stock.textContent = producto.stock + ' ml';    
            }else{
                stock.textContent = producto.stock;
            }

            const edit = document.createElement('td');
            edit.classList.add('botones');
            //const editBtn = document.getElementById('edit');
            const buttonEdit= document.createElement('button');
            buttonEdit.addEventListener('click', function () {
             //  hacerbtn.style='display:none';
                
                const btnEditTrue = document.createElement('button');
                btnEditTrue.id='editar'
                btnEditTrue.textContent='Editar producto';
                btnEditTrue.classList.add('btn','btn-primary');
                btnEditTrue.addEventListener('click',function (){
                    PutProducts(producto.id,DataToEdit);
                })
                articleBtn.appendChild(btnEditTrue);
                                
                span.innerText = '';
                emptyInputs();
                title.textContent = 'Editando '+producto.name;
                nombre.value = producto.name; 
                marca.value = producto.brand;
                categoria.value = producto.category;
                precio.value = producto.price;
                precioPorMayor.value = producto.wholPrice;
                disponibles.value = producto.stock;
            
                document.body.classList.add('show-modal');
                
                
                nombre.addEventListener('change', function () {
                    const value = nombre.value;
                    DataToEdit.nombre = value;
                });
                marca.addEventListener('change', function() {
                    const value = marca.value;
                    DataToEdit.marca = value;
                });
                categoria.addEventListener('change', function() {
                    const value = categoria.value;
                    DataToEdit.categoria = value;
                });
                precio.addEventListener('change', function() {
                    const value = precio.value;
                    DataToEdit.precio = value;
                });
                precioPorMayor.addEventListener('change',function () {
                    const value = precioPorMayor.value;
                    DataToEdit.porMayor=value
                })
                disponibles.addEventListener('change', function() {
                    const value = disponibles.value;
                    DataToEdit.stock = value;
                });
            
               // hacerbtn.classList.add('btnEditOff'); 
            
            });
            

            buttonEdit.classList.add('bi','bi-pencil-square','btn','btn-secondary');
            
            const buttonDelete= document.createElement('button');
            buttonDelete.classList.add('bi','bi-trash-fill','btn','btn-danger');
            
            buttonDelete.addEventListener('click',  function () {
                const DeleteButton = document.getElementById('botonParaBorrar');
                const cancelBtn = document.getElementById('cancela');
                const msg = document.getElementById('mensaje');
                msg.textContent = 'seguro que vas a borrar '+ producto.name+'?';
                cancelBtn.addEventListener('click',function () {
                    document.body.classList.remove('show-SeguroBorrar');
                })
                document.body.classList.add('show-SeguroBorrar');
                DeleteButton.addEventListener('click',async function () {
                    const Delete = await fetch(`http://localhost:4321/products/${producto.id}`,{
                        method:'DELETE'
                    });
                    if (Delete.ok) {
                        GetProducts();
                        Print();
                        return document.body.classList.remove('show-SeguroBorrar');
                    }
                })


            })
            ///////////////////////////
            edit.appendChild(buttonEdit);
            edit.appendChild(buttonDelete);
            ///////////////////////////
            fila.appendChild(codeBar);
            fila.appendChild(brand);
            fila.appendChild(name);
            fila.appendChild(category);
            fila.appendChild(price);
            fila.appendChild(wholPrice);
            fila.appendChild(stock);
            
            fila.appendChild(edit);
            tabla.appendChild(fila);
        });
        
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}Print();
// Seleccionamos los elementos necesarios
// Seleccionamos los elementos necesarios
const modal = document.getElementById('modal');
const btnOn = document.getElementById('ON');
const btnOff = document.getElementById('OFF');
const span = document.getElementById('span');
        span.innerText = '';
        
        modal.appendChild(span);


// Mostrar el modal y el overlay
btnOn.addEventListener('click', function () {
    const crearBtn = document.createElement('button');
    crearBtn.classList.add('btn','btn-success');
    crearBtn.textContent = 'Crear producto';
    crearBtn.id='botoncrear';
    articleBtn.appendChild(crearBtn);
    crearBtn.addEventListener('click',function () {
        CreateProduct();
    })
    //hacerbtn.style='display:block;'
    //hacerbtn.classList.add('btn','btn.succcess');
    span.innerText = '';
    emptyInputs();
    title.textContent = 'Creando producto'
    document.body.classList.add('show-modal');
    nombre.addEventListener('change',function () {
        const value = nombre.value;
        DataToCreate.nombre = value;
        
    });
    marca.addEventListener('change',function() {
        const value = marca.value;
        DataToCreate.marca = value;
    });
    categoria.addEventListener('change',function() {
        const value = categoria.value;
        DataToCreate.categoria = value;
    });
    precio.addEventListener('change',function() {
        const value = precio.value;
        DataToCreate.precio = value;
    });
    precioPorMayor.addEventListener('change',function() {
        const value = precioPorMayor.value;
        DataToCreate.porMayor = value;
    });
    disponibles.addEventListener('change',function() {
        const value = disponibles.value;
        DataToCreate.stock = value;
    });
   // hacerbtn.innerText = 'Crear Producto';
    //hacerbtn.addEventListener('click', function (){
      //  CreateProduct();
    //})
});

btnOff.addEventListener('click', function () {
    const crear = document.getElementById('botoncrear');
    const boton = document.getElementById('editar');
    //hacerbtn.style='display:none;';
    crear && articleBtn.removeChild(crear);
    boton && articleBtn.removeChild(boton);
   // editBtn.style='display:nonoe;';
   document.body.classList.remove('show-modal');
   span.innerText = '';
});

async function CreateProduct(object) {
    const response = await fetch('http://localhost:4321/products',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'},
    body:JSON.stringify({ 
        brand:DataToCreate.marca,
        name:DataToCreate.nombre,
        category:DataToCreate.categoria,
        price:DataToCreate.precio,
        wholPrice:DataToCreate.porMayor,
        stock:DataToCreate.stock
     })
    })
    if (response.ok) {
        console.log(DataToCreate);
        
        const span = document.createElement('span');
        span.innerText = 'Producto creado con exito';
        modal.appendChild(span);
        GetProducts();
    }
}

async function PutProducts(id,object) {
    console.log(id);
    
    const response = await fetch(`http://localhost:4321/products/${id}`,{
        method:'PUT',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({ 
            brand:object.marca,
            name:object.nombre,
            category:object.categoria,
            price:object.precio,
            wholPrice:object.porMayor,
            stock:object.stock
         })});
         if (response.ok) {
            span.innerText = 'Producto editado con exito';
            
            GetProducts();
            Print();
         }
}

function emptyInputs() {
    const inputs = document.getElementsByTagName('input');
   return [...inputs].forEach(element =>element.value ='')
}

/**
let PROMOS = [];
 async function GetPromos() {
    const response = await(await fetch('http://localhost:4321/promotions/')).json();
    console.log(response);
    
    PROMOS = response;
    RenderPromos()
    return
 };
 GetPromos();

function RenderPromos() {
    const container = document.getElementById('promoContainer');
    
    for (const promo of PROMOS) {
        console.log(promo.itempromotions);
        
        const promoCard = document.createElement('div');
        promoCard.classList.add('list-group-item', 'list-group-item-action');

        const title = document.createElement('h5');
        title.classList.add('mb-1');
        title.textContent = `Promoción ID: ${promo.id}`;

        const itemList = document.createElement('ul');
        for (const item of promo.itempromotions) {
            const itemElement = document.createElement('li');
            itemElement.textContent = item.product ?`${item.product.brand}-${item.product.name} (x${item.quantity}) `:'';
            itemList.appendChild(itemElement);
        }
        const amount = document.createElement('h5');
        amount.textContent ='precio total :$'+ promo.totalAmount;
        promoCard.appendChild(title);
        promoCard.appendChild(itemList);
        promoCard.appendChild(amount);
          // Contenedor para los botones
          const buttonContainer = document.createElement('div');
        buttonContainer.id = 'btncontainer'
          // Botón 1
          const button1 = document.createElement('button');
          button1.classList.add('btn', 'btn-danger', 'mb-1'); // mb-1 para el margen inferior
          button1.textContent = 'ELIMINAR';
          button1.onclick = () => {
              // Lógica para agregar la promoción
              alert(`Promoción ID ${promo.id} agregada.`);
          };

          // Botón 2
          const button2 = document.createElement('button');
          button2.classList.add('btn', 'btn-secondary');
          button2.textContent = 'EDITAR';
          button2.onclick = () => {
              // Lógica para eliminar la promoción
              alert(`Promoción ID ${promo.id} eliminada.`);
          };

          buttonContainer.appendChild(button1);
          buttonContainer.appendChild(button2);
          promoCard.appendChild(buttonContainer);
        container.appendChild(promoCard);
    }
}

const crearPromo = document.getElementById('crearPromo');
crearPromo.addEventListener('click',async function () {
    GetProductsToSelect();
    document.body.classList.add('show-modal-prom');
});
const cerrarPromo = document.getElementById('cerrarPromo');
cerrarPromo.addEventListener('click',function () {
    document.body.classList.remove('show-modal-prom');
});

const selectProductos = document.getElementById('selectProducts');
let productosSelect;
async function GetProductsToSelect() {
    try {
        const response = await fetch('http://localhost:4321/products');
        productosSelect = await response.json();
        return renderSelect();
    } catch (error) {
        console.error(error);
    }
}GetProductsToSelect();

function renderSelect() {
    selectProductos.innerHTML = '';
    for (const element of productosSelect) {
        const option = document.createElement('option');
        option.textContent = element.name;
        option.value = element.name;
        selectProductos.appendChild(option);
    }
}

const search = document.getElementById('buscar');
search.addEventListener('keyup', function () {
    const value = search.value.toLowerCase();
    productosSelect = productos.filter((element) => {
        return element.name.toLowerCase().includes(value) 
    });
    renderSelect();
    console.log(productosSelect);
});

search.addEventListener('focus', function () {
    productosSelect = productos;
});

search.addEventListener('input', function () {
    const value = search.value.toLowerCase();
    if (value === '') {
        productosSelect = productos;
        renderSelect();
    }
}); */


