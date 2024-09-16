import React, { useContext, useState } from 'react';
import { CartContext } from '../../App';
import styles from './cart.module.css';
import { CardCart } from '../CardCart/cardCart';
import { PostOrder } from '../../redux/actions';
import { useDispatch } from 'react-redux';

function Cart() {
const dispatch = useDispatch();
const {cart, setCart} = useContext(CartContext);
const [data,SetData] = useState({
  payMethod:'Efectivo',
  delivery:false,
  wholsale:false,
  nameClient:'',
}); 
const precioTotal = cart.reduce((a,b)=>a+b.totalPrice,0);
const precioTotalMayor = cart.reduce((a,b)=>a+b.wholTotal,0);
//console.log(precioTotalMayor);

const handleSubmit = ()=>{

const itemData = cart.map((element)=>{
  return {
    id:element.id,quantity:element.quantity
  }
});
dispatch(PostOrder({
    status:"confirmada",
    clientName:data.nameClient,
    productId:itemData,
    payMethod:data.payMethod,
    wholSale:data.wholsale,
    delivery:data.delivery
 }));
 return setCart([]);
}
const handleChecked = (e)=>{
  const {checked,name,value} = e.target;
  if (name === 'clientname') {
    return SetData((state)=>({...state,nameClient:value}))
  }else if (name === 'transfer') {
    
    return SetData((state)=>({...state,payMethod:checked?'Transferencia':'efectivo'}))
  }else if (name === 'delivery') {
    return SetData((state)=>({...state,delivery:checked}))
  }else if (name === 'wholsale') {
    return SetData((state)=>({...state,wholsale:checked}))
  }
}


  return (
    <section className={styles.contenedor}>
      <h2>Productos Seleccionados</h2>

      
      <article className={styles.cartcontainer}>
        {cart.length === 0 ? (
          <p>No has añadido productos</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>nombre</th>
                <th className={styles.th}>precio unitario</th>
                <th className={styles.th}>cantidad</th>
                <th className={styles.th}>total</th>
                <th className={styles.th}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
            {cart.map((item) => (
              <CardCart item={item} mayor={data.wholsale}></CardCart>
            ))}
            </tbody>
          </table>   
        )}
      </article>

      
      {cart.length !== 0 && 
      <section className={styles.footerCart}>
        <article className={styles.form}>
            <label className={styles.label}> Nombre del cliente :
              <input type="text" name='clientname' value={data.nameClient} className={styles.input} onChange={handleChecked}/>
            </label>
            <label className={styles.label}> Transferencia?
              <input type="checkbox" name='transfer' value={data.payMethod} className={styles.input} onChange={handleChecked} />
            </label>
            <label className={styles.label}> Delivery?
              <input type="checkbox" name='delivery' value={data.delivery} className={styles.input} onChange={handleChecked}/>
            </label>
            <label className={styles.label}> Por mayor?
              <input type="checkbox" name='wholsale' value={data.wholsale} className={styles.input} onChange={handleChecked}/>
            </label>
        </article>
        <article className={styles.cartsummary}>
          <h3>Total de productos: {cart.length}</h3>
          <button disabled={cart.length === 0} onClick={handleSubmit}>Confirmar compra</button>
          <h3>Precio total :${data.wholsale?precioTotalMayor:precioTotal}</h3>
        </article>
      </section>}
    </section>
  );
}

export default Cart;
