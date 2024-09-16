import express from 'express';
import db from '../db.mjs';
import { literal, Op } from 'sequelize';


const {orders,products,itemorder} = db;
const OrdersHandler = express.Router();

OrdersHandler.get ('/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const response = await orders.findOne({where:{id},include:[{model:itemorder,
            include:[products]
        }]});
        if (response) {
            return res.status(200).json(response);
        }
        else{
            return res.status(404).send('error al encontrar la id');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})
OrdersHandler.get('/',async(req,res)=>{
    try {
        const response = await orders.findAll({include:[{model:itemorder,
            include:[products]
        }]});
        if (!response) {
            res.status(400).send('error')
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

/**OrdersHandler.get('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const response = await orders.findOne({where:{id},include:[{model:itemorder,
            include:[products]
        }]});
        if (!response) {
            return res.status(404).send('orden no encontrada')
        }
            return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}); */

OrdersHandler.post('/',async(req,res)=>{
    const {clientName,createdAt,status,productId,wholSale,delivery,payMethod} = req.body;
    const productList = await products.findAll({where:{id:productId.map((e)=>e.id)}});
    try {
        let totalAmount = 0;
        for (const element of productId) {
            const product = productList.find((product)=>product.id === element.id);
            const wholePrice =product.wholPrice?product.wholPrice:product.price;
            const precio = wholSale ? wholePrice : product.price;
            if (product) {
                totalAmount += element.quantity * precio;
            }
        }
        const response = await orders.create({clientName,totalAmount,status,createdAt,wholSale,delivery,payMethod});
        for (const element of productId) {  
            const product = productList.find((product)=>product.id === element.id)
            const precio = wholSale ? product.wholPrice??product.price : product.price;
            console.log(product.wholPrice);
            
            if (response && product) {
                const response2 = await itemorder.create({orderId:response.id,productId:product.id,quantity:element.quantity,
                unitPrice:precio,
                totalPrice:element.quantity*precio})
                const update = await products.update({stock : literal(`stock - ${element.quantity}`)},{where:{id:element.id}});
            }; 
        };  
            return res.status(200).json(response );
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

OrdersHandler.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const orden = await orders.findOne({where:{id}});
        if (!orden) {
            return res.status(404).send('orden no encontrada')
        }
        const response = await orders.destroy({where:{id}});
        return res.status(200).send ('orden borrada' + response);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

OrdersHandler.get('/filter/today',async (req, res)=>{
    const today = new Date();
today.setHours(0,0,0,0);
    try {
        const response = await orders.findAll({include:[{model:itemorder,
            include:[products]
        }],where:{createdAt:{[Op.gte]:today}}})
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

OrdersHandler.get('/filter/yesterday',async(req,res)=>{
    const today = new Date();
        today.setHours(0,0,0,0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);  // Restar 1 día

    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);  
    try {
        const response = await orders.findAll({include:[{model:itemorder,
            include:[products]
        }],where:{createdAt:{[Op.gte]:yesterday,[Op.lte]:endOfYesterday}}})
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

OrdersHandler.get('/filter/lastWeek',async(req,res)=>{
    const today = new Date();
    today.setHours(23,59,59,999);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    try {
        const response = await orders.findAll({include:[{model:itemorder,
            include:[products]
        }],where:{createdAt:{[Op.gte]:lastWeek,[Op.lte]:today}}})
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

export default OrdersHandler;