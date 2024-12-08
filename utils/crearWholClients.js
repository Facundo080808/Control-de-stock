async function WholclientsCreate(array) {
    const clientsContainer= document.getElementById('clientsContainer');
    clientsContainer.textContent=''
    console.log(array);
    
    for (const element of array) {
        const card = document.createElement('div')
        card.classList.add('card')
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        const h5 = document.createElement('h5')
        h5.classList.add('card-title');
        h5.textContent = element.clientName;
        for (const e of element.itemorders) {
            const pe = document.createElement('p')
            pe.classList.add('card-text')
            pe.textContent = `${e.product.name} - ${e.quantity} x $${e.unitPrice} = $${e.totalPrice}`
            cardBody.appendChild(pe)
        }
        const p = document.createElement('p')
        p.classList.add('card-text')

        const createdAtDate = new Date(element.createdAt);

        const formattedDate = createdAtDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const strong = document.createElement('strong')
        strong.appendChild(p)
        p.textContent = formattedDate
        card.appendChild(cardBody)
        clientsContainer.appendChild(card)
        cardBody.appendChild(h5)
        cardBody.appendChild(strong)

    }
    
}
module.exports = WholclientsCreate