import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProducts } from "../../redux/actions";
import styles from "./home.module.css"; 
import { useContext } from "react";
import { CartContext } from "../../App";
import Cart from "../../components/Cart/cart";
import { Cards } from "../../components/Cards/cards";
import NavBar from "../../components/Nav/nav";
import Search from "../../components/Search/seach";


export function Home() {
    const allProducts = useSelector(state => state.reducerDeLaApp.Products);
    const dispatch = useDispatch();
    const [products, setProducts] = useState(allProducts);
    const {cart, setCart} = useContext(CartContext);
    useEffect(() => {
        dispatch(GetProducts());
        setProducts(allProducts);
    }, [dispatch]);

    useEffect(() => {
        setProducts(allProducts);
    }, [allProducts]);

    
    
    
    return (
        <main className={styles.main}>
            <NavBar></NavBar>
            <Search products={allProducts} setProducts={setProducts}></Search>
            <table className={styles.table}>
                
                <thead>
                    <tr>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Marca</th>
                        <th className={styles.th}>Precio</th>
                        <th className={styles.th}>Stock</th>
                        <th className={styles.th}>Cantidad</th>
                        <th className={styles.th}>Añadir a carrito</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(products) && products.map((element) => (
                        <Cards element={element}></Cards>
                    ))}
                </tbody>
            </table>
            <Cart disputch={dispatch}></Cart>
        </main>
    );
}
