import { json } from "react-router-dom";
import { orders, products } from "./reducer";

export function GetProducts() {
    return async (dispatch)=>{
        try {
            const response = await(await fetch('http://localhost:1111/products/')).json();
            const AZ = response.sort((a,b)=>a.name.localeCompare(b.name));
            return dispatch(products(AZ));
        } catch (error) {
            console.error(error.message);
        }
    }
}

export function PostOrder(objeto) {
    return async(dispatch)=>{
        try {
            const response = await fetch('http://localhost:1111/orders/',{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(objeto)
              });
              return dispatch(orders(await response.json()
              ))
        } catch (error) {
            console.error(error);
            
        }
    }
}

export function GetOrders() {
    return async (dispatch)=>{
        try {
            const response = await(await fetch('http://localhost:1111/orders/')).json();
            return dispatch(orders(response));
        } catch (error) {
            console.error(error);
        }
    }
}

export function GetOrdersLastWeek() {
    return async (dispatch)=>{
        try {
            const response = await(await fetch('http://localhost:1111/orders/filter/lastWeek')).json();
            return dispatch(orders(response));
        } catch (error) {
            console.error(error);
        }
    }
}

export function GetOrdersYesterday() {
    return async (dispatch)=>{
        try {
            const response = await(await fetch('http://localhost:1111/orders/filter/yesterday')).json();
            return dispatch(orders(response));
        } catch (error) {
            console.error(error);
        }
    }
}

export function GetOrdersToday() {
    return async (dispatch)=>{
        try {
            const response = await(await fetch('http://localhost:1111/orders/filter/today')).json();
            return dispatch(orders(response));
        } catch (error) {
            console.error(error);
        }
    }
}