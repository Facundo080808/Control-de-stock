import server from "./src/app.mjs";
import con from "./src/db.mjs";
import { UploadProducts } from "./src/utils/uploadProducts.mjs";

const port = process.env.PORT || "1111"
const { conn } = con;
conn.sync({ force: false }).then(() => {
  server.listen(port, () => {
   //UploadProducts();
    console.log('Server running at http://localhost:1111/');
  });
});
