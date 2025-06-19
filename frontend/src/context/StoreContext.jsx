import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import axios from "axios"

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFood_List] = useState([])

  const url = "https://flick-be.onrender.com"
  
  const addtocart = (itemId) => {
    if(!cartItems[itemId]){
      setCartItems((prev)=>({...prev,[itemId]:1}))
    }
    else{
      setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    }
  }
  
  const removefromcart = (itemId) => {
    setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}))
  }

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");
    setFood_List(response.data.data)
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItems){
        if(cartItems[item]>0){
            let itemInfo = food_list.find((product) => product._id === item);
            totalAmount = totalAmount + (itemInfo.price*cartItems[item]);
        }
    }
    return totalAmount;
  }

  useEffect(() => {
    async function loadData () {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"))
      } 
    }
    loadData();
  },[])

  const contextValue = {
    food_list, addtocart, removefromcart, cartItems, setCartItems, getTotalCartAmount, url, token, setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
