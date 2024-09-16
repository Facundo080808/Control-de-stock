import { useState } from "react";

function Search({products,setProducts}) {    
    const [Input,setInput] = useState('');
    const handleSearch = (name) => {
        const item = products.filter((element) => {
            if (element.name.toString().toLowerCase().includes(name.trim().toLowerCase())) {
                return element;
            }
        });
        return setProducts(item);
    }
    return(
        <label htmlFor="">
            <input type="text" 
            placeholder="Busqueda"
            value={Input} 
            onChange={(e)=>{
                setInput(e.target.value);
                handleSearch(e.target.value)}
                }/>
        </label>
    )
}
export default Search;