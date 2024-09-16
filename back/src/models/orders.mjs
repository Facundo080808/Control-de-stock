import { DataTypes } from "sequelize";

export default (sequelize)=>{
    return sequelize.define("orders",{
        id:{
            primaryKey:true,
            type:DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1
        },
        clientName:{
            type:DataTypes.STRING
        },
        payMethod:{
            type:DataTypes.STRING,
            defaultValue:'Efectivo',
            allowNull:false
        },
        delivery:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:false
        },
        wholSale:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:false
        },
        totalAmount:{
            type:DataTypes.DECIMAL(10, 2),
            allowNull:false,
        },
        status:{
            type:DataTypes.STRING,
            allowNull:false
        },
        createdAt: {
            type: DataTypes.DATE, 
            allowNull: false,
            defaultValue: DataTypes.NOW 
          }
    });
};