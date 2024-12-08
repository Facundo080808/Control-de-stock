const server =require( "../back/src/app.js");
const con =require("../back/src/db.js");
const UploadOrders = require('../back/src/utils/uploadOrders.js');
const  UploadProducts = require("../back/src/utils/uploadProducts.js");
const { conn } = con;
async function raiseServer() {
    await conn.sync({ force: false }).then(() => {
        server.listen(4321, () => {
        //  UploadProducts();
        //  UploadOrders();
          console.log('Server running at http://localhost:4321/');
        });
        });    
}

module.exports = raiseServer
