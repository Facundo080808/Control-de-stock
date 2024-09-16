import db from "../db.mjs";
import { api } from "./productsArray.mjs";

const {products} = db;

export async function UploadProducts() {
    const response = api.map(async(element)=>{
       return await products.create({
        brand:element.brand,
        name:element.name,
        category:element.category,
        price:element.price,
        stock:element.stock,
        wholPrice:element.wholPrice
       })
    })
    return response;
};
