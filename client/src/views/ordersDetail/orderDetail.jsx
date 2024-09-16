import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import styles from './OrderDetail.module.css';
import NavBar from '../../components/Nav/nav';
export const OrderDetail = ()=>{
    const [order ,setData] = useState(null);
    const {id} = useParams();
    useEffect(()=>{
        async function Data(id) {
            const response = await(await fetch(`http://localhost:1111/orders/${id}`)).json();
            return setData(response);
        }
        Data(id);
    },[])
    console.log(order);
    if (!order) {
        return <p>Cargando detalles de la orden...</p>;
      }
      
    return(
        <main>
            <NavBar></NavBar>
        <div className={styles.container}>
        <h1>Detalle de la Orden</h1>
  
        <div className={styles.detailItem}>
          <strong>ID de la Orden:</strong>
          <span className={styles.detailValue}>{order.id}</span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Cliente:</strong>
          <span className={styles.detailValue}>{order.clientName || 'No especificado'}</span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Método de Pago:</strong>
          <span className={styles.detailValue}>{order.payMethod}</span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Entrega a domicilio:</strong>
          <span className={`${styles.delivery} ${order.delivery ? '' : styles.false}`}>
            {order.delivery ? 'Sí' : 'No'}
          </span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Compra al por mayor:</strong>
          <span className={`${styles.wholSale} ${order.wholSale ? '' : styles.false}`}>
            {order.wholSale ? 'Sí' : 'No'}
          </span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Total:</strong>
          <span className={styles.totalAmount}>${order.totalAmount}</span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Estado de la orden:</strong>
          <span className={styles.status}>{order.status}</span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Fecha de creación:</strong>
          <span className={styles.detailValue}>
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
  
        <div className={styles.detailItem}>
          <strong>Última actualización:</strong>
          <span className={styles.detailValue}>
            {new Date(order.updatedAt).toLocaleString()}
          </span>
        </div>
        <div className={styles.detailItemProducts}>
          <strong>Productos :</strong>
          {Array.isArray(order.itemorders)&&order.itemorders.map(item => (
                  <span className={styles.detailValueProducts}>
                    {item.product.name} - {item.quantity} x ${item.unitPrice}
                  </span>
                ))}
        </div>
      </div>
        </main>
    )
}