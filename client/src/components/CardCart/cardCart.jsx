import { useQuantity } from "../../hooks/useQuantity"
import { CartContext ,TotalPriceContext } from "../../App"
import { useContext, useEffect } from "react";
import styles from './cardCart.module.css';
import { MdDeleteForever } from "react-icons/md";
export function CardCart({item,mayor}) {
    
    const {cart,setCart} = useContext(CartContext);
    const precio =mayor ?item.wholPrice??item.price:item.price;

    return(
        <tr key={item.id} className={styles.tr}>
              
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}> ${precio}</td>
                  
                  <td className={styles.td}>x{item.quantity}</td>
                
              
              <td className={styles.td}>${item.quantity*precio}</td>
              <td className={styles.td}> 
                 <button className={styles.delete} onClick={() =>setCart(cart.filter((element)=>element.id !== item.id)) }><MdDeleteForever /></button>
            </td>
          </tr>
    )
}