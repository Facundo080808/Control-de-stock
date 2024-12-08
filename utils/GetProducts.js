async function Get() {
    try {
            const response = await(await fetch('http://localhost:4321/products')).json();
        // for (const element of response) {
        //     element.quantity=1;
        //     element.priceTotal = wholPrice?element.wholPrice * element.price:element.quantity * element.price;
        // }
        return response
    } catch (error) {
        console.error('Error al obtener los productos: ', error);
    }
}

module.exports = Get