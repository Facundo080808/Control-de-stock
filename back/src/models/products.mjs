import { DataTypes } from "sequelize";

export default (sequelize)=>{
    return sequelize.define("products",{
        id:{
            primaryKey:true,
            type:DataTypes.INTEGER,
            autoIncrement:true,
        },
        brand:{
            type:DataTypes.STRING,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        category: {
            type: DataTypes.STRING,
            allowNull:false
        },
        price:{
         type:DataTypes.STRING,
         allowNull:false   
        },
        wholPrice:{
            type:DataTypes.STRING,    
        },
        stock:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        }
    })
}