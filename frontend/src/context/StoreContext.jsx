import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import axios from "axios"
import { food_list as staticFoodList } from "../assets/assets";
import { toast } from 'react-toastify';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFood_List] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discount, setDiscount] = useState(0);

  const url = "https://flick-be.onrender.com"
  
  const addtocart = async (itemId) => {
    if (!token) {
      // If not logged in, use local storage
      if(!cartItems[itemId]){
        setCartItems((prev)=>({...prev,[itemId]:1}))
      }
      else{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
      }
      toast.success("Item added to cart!");
      return;
    }

    try {
      const response = await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      if (response.data.success) {
        if(!cartItems[itemId]){
          setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
          setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        toast.success("Item added to cart!");
      }
    } catch (error) {
      toast.error("Error adding item to cart");
    }
  }

  const removefromcart = async (itemId) => {
    if (!token) {
      // If not logged in, use local storage
      setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}))
      toast.info("Item removed from cart!");
      return;
    }

    try {
      const response = await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      if (response.data.success) {
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}))
        toast.info("Item removed from cart!");
      }
    } catch (error) {
      toast.error("Error removing item from cart");
    }
  }

  const fetchFoodList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(url+"/api/food/list");
      if (response.data.success && response.data.data.length > 0) {
        setFood_List(response.data.data);
      } else {
        // Use static data as fallback
        setFood_List(staticFoodList);
      }
    } catch (error) {
      console.log("Failed to fetch food list from backend, using static data");
      // Use static data as fallback
      setFood_List(staticFoodList);
    } finally {
      setIsLoading(false);
    }
  }

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log("Error loading cart data:", error);
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItems){
        if(cartItems[item]>0){
            let itemInfo = food_list.find((product) => product._id === item);
            if (itemInfo) {
              totalAmount = totalAmount + (itemInfo.price*cartItems[item]);
            }
        }
    }
    return totalAmount;
  }

  useEffect(() => {
    async function loadData () {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        await loadCartData(storedToken);
      } else {
        // Load cart from localStorage for non-logged in users
        const localCart = localStorage.getItem("cartItems");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    }
    loadData();
  },[])

  // Save cart to localStorage for non-logged in users
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token])

  // Function to sync local cart with backend when user logs in
  const syncCartOnLogin = async (userToken) => {
    const localCart = localStorage.getItem("cartItems");
    if (localCart) {
      const localCartItems = JSON.parse(localCart);
      // If there are items in local cart, sync them with backend
      for (const itemId in localCartItems) {
        if (localCartItems[itemId] > 0) {
          for (let i = 0; i < localCartItems[itemId]; i++) {
            try {
              await axios.post(url + "/api/cart/add", { itemId }, { headers: { token: userToken } });
            } catch (error) {
              console.log("Error syncing cart item:", error);
            }
          }
        }
      }
      // Clear local cart after syncing
      localStorage.removeItem("cartItems");
    }
    // Load cart from backend
    await loadCartData(userToken);
  };

  // Function to clear cart on logout
  const clearCartOnLogout = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  const contextValue = {
    food_list, addtocart, removefromcart, cartItems, setCartItems, getTotalCartAmount, url, token, setToken, appliedPromo, setAppliedPromo, discount, setDiscount, isLoading, syncCartOnLogin, clearCartOnLogout, loadCartData
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
