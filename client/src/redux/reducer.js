import { createSlice } from "@reduxjs/toolkit";

const todo = createSlice({
    name:"ordersProducts",
    initialState:{Products:[],Orders:[]},reducers:{
        products:(state,action)=>{
            state.Products = action.payload
        },
        orders:(state,action)=>{
            state.Orders=action.payload
        }
    }
});

export const {reducer} = todo;
export const {products,orders} = todo.actions;