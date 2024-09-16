import { Link } from 'react-router-dom';
import { CartContext } from '../../App';
import styles from './cards.module.css';
import { useContext } from 'react';
import { GrEdit } from 'react-icons/gr';
import { TiShoppingCart } from 'react-icons/ti';
import { useQuantity } from '../../hooks/useQuantity';


export function Cards({element}) {
    const {cart, setCart} = useContext(CartContext);
    const [restart,totalPrice,wholeTotalPrice,quantity, handleIncrement, handleDecrement] = useQuantity(element);

    return(
    <tr key={element?.id} className={styles.tr}>
    <td className={styles.td}>{element?.name} </td>
    <td className={styles.td}>{element?.brand}</td>
    <td className={styles.td}>${element?.price}</td>
    <td className={styles.td}>{element?.stock}</td>
    <td className={styles.td}>
        <button onClick={handleDecrement}>-</button>
        <span>{quantity}</span>
        <button onClick={handleIncrement}>+</button>
    </td>
    {/*<td className={styles.td}>
        <Link style={{color:'black'}}>
             <GrEdit />
        </Link>
    </td>*/}
    <td className={styles.td}>
        <button style={{background:'transparent'}} onClick={()=>{
            if (cart.find((e)=>e.id === element.id)) {
                return
            }
            const filtred = [...cart].filter((elemento)=>elemento.id === element.id);
            const noRepeat = new Set([...cart,{...element,quantity : quantity, totalPrice : totalPrice,wholTotal:wholeTotalPrice}]);
            setCart([...noRepeat])
            return restart();
        }}>
        <TiShoppingCart />
        </button>
    </td>
</tr>)
}