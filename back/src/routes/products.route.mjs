import express from 'express';
import db from '../db.mjs';
import { where } from 'sequelize';


const {orders,products,itemorder} = db;

 export const productsHandler = express.Router();


productsHandler.get('/',async(req,res)=>{
    try {
        const response = await products.findAll();
        if (!response) {
            res.status(400).send('error')
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});
productsHandler.get('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const response = await products.findOne({where:{id}});
        if (!response) {
            return res.status(404).send('producto no encontrado')
        }
            return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
});

productsHandler.post('/',async(req,res)=>{
    const {id,brand,name,category,price,stock} = req.body;
    try {
        const response = await products.create({id,brand,name,category,price,stock});
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
});

productsHandler.put('/:id',async (req,res)=>{
    const {id}= req.params;
    const {brand,name,category,price,stock} =req.body;
    try {
        const product = await products.findOne({where:{id}})
        if (!product) {
            return res.status(404).send('producto no encontrado')
        }
        const response = await products.update({brand,name,category,price,stock})
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
});

productsHandler.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const producto = await products.findOne({where:{id}});
        if (!producto) {
            return res.status(404).send('producto no encontrado')
        }
        const response = await products.destroy({where:{id}});
        return res.status(200).send('producto eliminado' + response)
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});


export default productsHandler;