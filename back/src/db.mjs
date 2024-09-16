import Products from './models/products.mjs';
import ItemOrder from './models/itemOrder.mjs';
import Orders from './models/orders.mjs';
import dotenv from 'dotenv';
//require('dotenv').config();
import { Sequelize} from 'sequelize';
import itemOrder from './models/itemOrder.mjs';
//import fs from 'fs';
//import path from 'path"

dotenv.config();
const {
  DB_USER, DB_PASSWORD, DB_HOST,DB_DEPLOY
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/osvaldo`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

Products(sequelize);
ItemOrder(sequelize);
Orders(sequelize);
const {products,itemorder,orders} =sequelize.models;
  
orders.hasMany(itemorder,{
  foreignKey:'orderId',
  sourceKey:'id'
  
});
itemorder.belongsTo(orders,{
  foreignKey:'orderId',
  tergetKey:'id'
});
products.hasMany(itemorder,{
  foreignKey:'productId',
  sourceKey:'id'
});
itemorder.belongsTo(products,{
  foreignKey:'productId',
  targetKey:'id'
});

export default {
  ...sequelize.models,
  conn: sequelize,      
};






































