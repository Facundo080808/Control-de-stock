const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const generateHTML = require('./utils/generarHtml');


ipcMain.on('printticket',async function (_,order) {
    console.log('estas en el evento');
    
    const ticketHTML = generateHTML(order);
    console.log(ticketHTML);
    const printWin = new BrowserWindow({ show: true }); 
    printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(ticketHTML)}`);

    printWin.webContents.on('did-finish-load', () => {
        printWin.webContents.print(
            { silent: true, printBackground: true },
            success => {
                if (success) {
                    console.log('Impresión completada');
                } else {
                    console.error('Error en la impresión');
                }
                printWin.close();
            }
        );
    });
})
const createWindow = async () => {
    let isDev = await import('electron-is-dev');
    
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    isDev && win.webContents.openDevTools();
    win.loadFile('index.html'); // Cargar el archivo HTML
};




ipcMain.handle('crearticket', async (event, data) => {
    console.log('Manejador de crearticket registrado');
    const pdfDir = path.join(app.getPath('userData'), 'tickets');
    const pdfFilePath = path.join(pdfDir, 'tickets.pdf');

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }

    try {
        const ticketWidth = 226; // 226 píxeles = 80mm (tamaño típico de impresora térmica)
    const ticketHeight = 9999;
        const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 }  });

        // Crear un stream de escritura para el PDF
        const writeStream = fs.createWriteStream(pdfFilePath);
        doc.pipe(writeStream);

        const centerX = (doc.page.width - ticketWidth) / 2;
        doc.translate(centerX, 50); //
        const fechaCreacion = new Date(data.createdAt).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    
        // Título del ticket
        doc.fontSize(16).text('PURO LIMPIO', { align: 'left' });
        doc.moveDown();
        doc.fontSize(12).text('----------------------------', { align: 'left' });
        doc.moveDown();
        
        
        // Iterar sobre los productos
        data.itemorders.forEach(item => {
            doc.fontSize(12).text(`${item.product.name} - ${item.quantity}x ${item.unitPrice} = $${item.quantity * item.unitPrice}`, { align: 'left' });
            doc.moveDown();
        });
        
        // Línea de separación y total de la compra
        doc.moveDown();
        doc.text('----------------------------', { align: 'left' });
        doc.moveDown();
        // Agregar la fecha y el método de pago
        doc.fontSize(10).text(`Fecha: ${fechaCreacion}`, { align: 'left' });
        doc.fontSize(10).text(`Método de pago: ${data.payMethod}`, { align: 'left' });
        doc.moveDown();
        doc.text(`Precio de la compra: $${data.totalAmount}`, { align: 'left' });

        // Finalizar el documento
        doc.end();

        // Retornar la ruta del archivo una vez finalizado el stream de escritura
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        console.log('PDF guardado en:', pdfFilePath);
        return pdfFilePath;
    } catch (error) {
        console.error('Error al crear el PDF:', error);
        throw error; // Lanza el error para manejarlo en el renderer
    }
});



app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});














/**
 * ipcMain.handle('crearticket', async (event, data) => {
    console.log('Manejador de crearticket registrado');
    const pdfDir = path.join(app.getPath('userData'), 'tickets');
    const pdfFilePath = path.join(pdfDir, 'tickets.pdf');

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }

    let pdfDoc;

    try {
        if (fs.existsSync(pdfFilePath)) {
            console.log('El archivo PDF ya existe, procediendo a modificarlo...');
            const existingPdfBytes = fs.readFileSync(pdfFilePath);
            pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            let yOffset = firstPage.getHeight() - 50; // Coordenada Y para empezar a escribir
            firstPage.drawText('Nuevas Órdenes:', {
                x: 50,
                y: yOffset,
                size: 14,
            });

            yOffset -= 20; // Espacio entre líneas

            for (const item of data.itemorders) {
                firstPage.drawText(`${item.product.name} - ${item.quantity}x ${item.unitPrice} = $${item.quantity * item.unitPrice}`, {
                    x: 50,
                    y: yOffset,
                    size: 12,
                });
                yOffset -= 20;
            }

        } else {
            console.log('El archivo PDF no existe, creando uno nuevo...');
            pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([400, 600]); // Tamaño de la página
            
            let yOffset = page.getHeight() - 50

            page.drawText('Ticket de Compra', { x: 50, y: 350, size: 16 });
            yOffset -= 30;
            page.drawText('----------------------------', { x: 50, y: 320, size: 12 });
            yOffset -= 20;

            for (const item of data.itemorders) {
                page.drawText(`${item.product.name} - ${item.quantity}x ${item.unitPrice} = $${item.quantity * item.unitPrice}`, {
                    x: 50,
                    y: 300 - (20 * data.itemorders.indexOf(item)), // Espaciado dinámico
                    size: 12,
                });
                yOffset -= 20;
            }
            yOffset -= 20;
            page.drawText('----------------------------', { x: 50, y: 250, size: 12 });
            yOffset -= 20;
            page.drawText(`Precio de la compra: $${data.totalAmount}`, { x: 50, y: 230, size: 12 });
        }

        const modifiedPdfBytes = await pdfDoc.save();
        fs.writeFileSync(pdfFilePath, modifiedPdfBytes);
        console.log('PDF guardado en:', pdfFilePath);
        
        return pdfFilePath;  // Devolver la ruta del archivo PDF
    } catch (error) {
        console.error('Error al crear o modificar el PDF:', error);
        throw error; // Lanza el error para manejarlo en el renderer
    }
});
 */