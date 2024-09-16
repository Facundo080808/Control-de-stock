import express from 'express';
import db from '../db.mjs';

const {orders,products,itemorder} = db;
const ItemsOrderHandler = express.Router(); 

