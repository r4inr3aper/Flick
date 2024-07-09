import { useContext } from "react";
import PropTypes from "prop-types";
import styles from "./Cart.module.scss";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";


const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removefromcart, food_list, getTotalCartAmount } = useContext(StoreContext);
  const url = "http://localhost:3000"

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <div className={styles.title}>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div className={`${styles.list} ${styles.title}`} key={item._id}>
                <img src={url+"/images/"+item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>${item.price * cartItems[item._id]}</p>
                <p className={styles.cross} onClick={() => removefromcart(item._id)}>x</p>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className={styles.bottom}>
        <div className={styles.total}>
          <h2>Cart Total</h2>
          <div className={styles.total}>
            <div className={styles.details}>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className={styles.details}>
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?"0":"2"}</p>
            </div>
            <hr />
            <div className={styles.details}>
              <p>Total</p>
              <p>${getTotalCartAmount()===0?"0":getTotalCartAmount() + 2}</p>
            </div>
            <hr />
          </div>
          <button onClick={()=>navigate("/Order")}>proceed to checkout</button>
          {/* <Link to="/Order"><button>proceed to checkout</button></Link> */}
        </div>
        <div className={styles.promo}>
          <p>if you have any promo code, enter it here</p>
          <div className={styles.promoinput}>
          <input type="text" placeholder="promo code"/>
          <button>submit</button></div>
        </div>
      </div>
    </div>
  );
};

Cart.propTypes = {
  cartItems: PropTypes.object,
  removefromcart: PropTypes.func,
  food_list: PropTypes.array
};

export default Cart;
