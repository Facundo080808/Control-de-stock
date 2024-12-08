const generateHTML = order => {
    const { id, employee, clientName, payMethod, delivery, wholSale, totalAmount, createdAt, itemorders } = order;

    const itemsHTML = itemorders.map(item => `
        <tr>
            <td>${item.productName}</td>
            <td>${item.quantity} x $${item.unitPrice.toFixed(2)}</td>
            <td>$${item.totalPrice.toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                .total { font-weight: bold; text-align: right; }
            </style>
        </head>
        <body>
            <h2>Orden de Compra</h2>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Empleado:</strong> ${employee}</p>
            <p><strong>Cliente:</strong> ${clientName}</p>
            <p><strong>Método de Pago:</strong> ${payMethod}</p>
            <p><strong>Delivery:</strong> ${delivery ? 'Sí' : 'No'}</p>
            <p><strong>Mayorista:</strong> ${wholSale ? 'Sí' : 'No'}</p>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad x Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" class="total">Total:</td>
                        <td>$${totalAmount.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <p><strong>Fecha:</strong> ${new Date(createdAt).toLocaleString()}</p>
        </body>
        </html>
    `;
};

module.exports = generateHTML