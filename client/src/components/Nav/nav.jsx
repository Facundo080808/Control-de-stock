import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './nav.module.css'; 
import { useDispatch, useSelector } from "react-redux";
import { GetOrders, GetOrdersLastWeek, GetOrdersToday, GetOrdersYesterday } from '../../redux/actions';

const NavBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [title, setTitle] = useState();
  useEffect(()=>{
    if (location.pathname.includes('orders') ) {
      setTitle('Ordenes de compra')
    }
    else{
      setTitle('Control de stock')
    }

  },[])
  const handleSwitch = (e)=>{
    const {value }=e.target;  
    switch (value) {
      case 'default':
        dispatch(GetOrders())
        break;
      case 'today':
        dispatch(GetOrdersToday());
        break;
      case 'yesterday':
        dispatch(GetOrdersYesterday());
        break;
      case 'lastWeek':
        dispatch(GetOrdersLastWeek());
        break;
      default:
        break;
    }
  }
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>Inicio</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/orders" className={styles.navLink}>Órdenes</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/products" className={styles.navLink}>Productos</Link>
        </li>
      </ul>
      <h1 className={styles.title}>{title}</h1>
      <label >
        <select onChange={handleSwitch}>
          <option value="default" defaultChecked>Todas</option>
          <option value="today">Hoy</option>
          <option value="yesterday">Ayer</option>
          <option value="lastWeek">Hace una semana</option>
        </select>
      </label>
    </nav>
  );
};

export default NavBar;
