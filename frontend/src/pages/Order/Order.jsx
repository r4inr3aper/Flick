import { useContext } from "react";
import styles from "./Order.module.scss";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Order = () => {
  const {getTotalCartAmount}= useContext(StoreContext)
  const navigate = useNavigate();
  return (
    <form>
      <div className={styles.left}>
        <p>delivery information</p>
        <div className={styles.fields}>
          <input type="text" placeholder="first name" />
          <input type="text" placeholder="Last name" />
        </div>
        <input type="text" placeholder="email" />
        <input type="email" placeholder="street" />
      <div className={styles.fields}>
        <input type="text" placeholder="city" />
        <input type="text" placeholder="state" />
      </div>
      <div className={styles.fields}>
        <input type="text" placeholder="pin code" />
        <input type="text" placeholder="country" />
      </div>
      <input type="text" placeholder="phone" />      
      </div>
      <div className={styles.right}>
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
      </div>
    </form>
  );
};

export default Order;
