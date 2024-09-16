import { useState } from "react";
export function useQuantity(element) {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = ()=>{
      /**  if (quantity > element.stock) {
            return setSpan("Cantidad maxima en stok " +quantity )
        }
        setSpan('') */
        return setQuantity(quantity + 1);
    }

    const handleDecrement = ()=>{
        if (quantity === 1) {
            return
        }
        
        return setQuantity(quantity - 1);
    }
    const restart = ()=>{setQuantity(1)}
    const totalPrice = quantity * element.price;
    console.log();
    const wholePrice = element.wholPrice? element.wholPrice:element.price;
    const wholeTotalPrice = quantity * wholePrice;
    return [restart,totalPrice,wholeTotalPrice ,quantity, handleIncrement, handleDecrement]
}