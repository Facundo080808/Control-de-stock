import { useState,createContext } from 'react'
import { BrowserRouter, Routes, Route, Await } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from './views/home/home';
import OrdersTable from './views/orders/orders';
import { OrderDetail } from './views/ordersDetail/orderDetail';
export const CartContext = createContext(null);
export const TotalPriceContext = createContext(null);
function App() {
  const [cart,setCart] = useState([]);
  const [total, setTotal] = useState([]);
  
  return (
    <>
      <TotalPriceContext.Provider value={{total,setTotal}}>
      <CartContext.Provider value={{cart,setCart}}>
        <BrowserRouter>
          <Routes>
              <Route path='/orders/:id'element={<OrderDetail></OrderDetail>}></Route>
            <Route path='/'element={<Home></Home>}></Route>
            <Route path='/orders'element={<OrdersTable></OrdersTable>}></Route>
         </Routes>
        </BrowserRouter>
        </CartContext.Provider>
        </TotalPriceContext.Provider>
    </>
  )
}

export default App
