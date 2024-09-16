import React, { useEffect } from 'react';
import styles from './orders.module.css';
import { useDispatch, useSelector } from "react-redux";
import { GetOrders } from '../../redux/actions';
import NavBar from '../../components/Nav/nav';
import { Link } from 'react-router-dom';
const OrdersTable = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state)=>state.reducerDeLaApp.Orders);
    useEffect(()=>{
        dispatch(GetOrders());
    },[dispatch]);
    console.log(orders);
    
  return (
    <main className={styles.container}>
        <NavBar></NavBar>
      <h2>Órdenes de Compra</h2>
      <table className={styles.ordersTable}>
        <thead>      
          <tr>
            <th>Nombre del cliente</th>
            <th>Fecha y hora</th>
            <th>Método de Pago</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length>0 ?orders.map(order => (
            <tr key={order.id}>
              <td>   
              <Link to={`/orders/${order.id}`} >{order.clientName?order.clientName:'indefinido'}</Link>
              </td>
              <td>
              <Link to={`/orders/${order.id}`} >{new Date(order.createdAt).toLocaleString()}
                </Link>
              </td>
              <td>
              <Link to={`/orders/${order.id}`} >{order.payMethod}</Link>
              </td>
              <td>
                {Array.isArray(order.itemorders)&&order.itemorders.map(item => (
                  <div key={item.id}>
                    <Link to={`/orders/${order.id}`} >{item.product.name} - {item.quantity} x ${item.unitPrice}</Link>
                  </div>
                ))}
              </td>
              <td>
              <Link to={`/orders/${order.id}`} >{order.status}</Link>
              </td>
              <td>
              <Link to={`/orders/${order.id}`} >${order.totalAmount}</Link>
              </td>
            </tr>
          )):<tr><h1>Aun no existen ordenes</h1></tr>}
        </tbody>
      </table>
    </main>
  );
};

export default OrdersTable;
