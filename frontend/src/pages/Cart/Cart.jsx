import { useContext, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Cart.module.scss";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import { Link } from "react-router-dom";


const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removefromcart, food_list, getTotalCartAmount, url, appliedPromo, setAppliedPromo, discount, setDiscount } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState("");

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const response = await axios.post(url + "/api/promo/validate", {
        code: promoCode,
        orderAmount: getTotalCartAmount()
      });

      if (response.data.success) {
        setAppliedPromo(response.data.promoCode);
        setDiscount(response.data.discount);
        toast.success(`Promo code applied! You saved $${response.data.discount}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error applying promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setDiscount(0);
    setPromoCode("");
    toast.info("Promo code removed");
  };

  const getFinalTotal = () => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    return subtotal + deliveryFee - discount;
  };

  // Handle both static images (imported) and backend images (filename strings)
  const getImageSrc = (image) => {
    // If image is a string (backend data), construct URL
    if (typeof image === 'string') {
      return url + "/images/" + image;
    }
    // If image is an imported object (static data), use it directly
    return image;
  };

  // Check if cart is empty
  const isCartEmpty = getTotalCartAmount() === 0;

  if (isCartEmpty) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button onClick={() => navigate("/")} className={styles.shopNowBtn}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

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
                <img src={getImageSrc(item.image)} alt={item.name} />
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
            {appliedPromo && (
              <>
                <div className={styles.details}>
                  <p>Discount ({appliedPromo})</p>
                  <p>-${discount}</p>
                </div>
                <hr />
              </>
            )}
            <div className={styles.details}>
              <p>Total</p>
              <p>${getTotalCartAmount()===0?"0":getFinalTotal()}</p>
            </div>
            <hr />
          </div>
          <button onClick={()=>navigate("/Order")}>proceed to checkout</button>
          {/* <Link to="/Order"><button>proceed to checkout</button></Link> */}
        </div>
        <div className={styles.promo}>
          <p>if you have any promo code, enter it here</p>
          <div className={styles.promoinput}>
            <input
              type="text"
              placeholder="promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={appliedPromo}
            />
            {appliedPromo ? (
              <button onClick={removePromoCode} className={styles.removeBtn}>
                Remove
              </button>
            ) : (
              <button onClick={applyPromoCode}>Apply</button>
            )}
          </div>
          {appliedPromo && (
            <p className={styles.appliedPromo}>
              ✓ Promo code "{appliedPromo}" applied! You saved ${discount}
            </p>
          )}
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
