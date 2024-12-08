


async function Post(productsInCart,DatosToSend) {
    let priceAndQuantity = productsInCart.map((element)=>{
        return {
            id:element.id,
            quantity:element.quantity
        }
    }); 
    try {
        const response = await fetch('http://localhost:4321/orders/', {
            method:'POST',
            headers: {
                    'Content-Type': 'application/json'},
            body:JSON.stringify({  
                clientName:DatosToSend.name,
                description:DatosToSend.descripcion,
                delivery:DatosToSend.delivery,
                payMethod:DatosToSend.payMethod,
                productId :priceAndQuantity,
                wholSale:DatosToSend.wholSale,
                employee:DatosToSend.employee
            })
            
        })
        if (response.ok) {
             let data = await response.json();
            alert('Venta realizada exitosamente');
            return data
        } else {
           alert('error al crear la compra') 
        }
    
    } catch (error) {
        console.error(error.message);  
    }
}

module.exports = Post
