import { useContext, useState, useEffect } from "react";
import styles from "./Order.module.scss";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Order = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, appliedPromo, setAppliedPromo, discount, setDiscount, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [promoCode, setPromoCode] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

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

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getFinalTotal(),
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        // Apply promo code usage if one was used
        if (appliedPromo) {
          try {
            await axios.post(url + "/api/promo/apply", { code: appliedPromo });
          } catch (promoError) {
            console.log("Error applying promo code usage:", promoError);
          }
        }
        // Clear cart after successful order
        setCartItems({});
        toast.success("Order placed successfully! Redirecting to your orders...");
        setTimeout(() => {
          navigate("/MyOrders");
        }, 2000);
      } else {
        toast.error("Error placing order");
      }
    } catch (error) {
      toast.error("Error placing order");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Place Your Order</h1>
        <p>Fill in your delivery details and complete your order</p>
      </div>

      <form onSubmit={placeOrder} className={styles.orderForm}>
          <div className={styles.left}>
            <p className={styles.title}>Delivery Information</p>
            <div className={styles.fields}>
              <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
              <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" />
            </div>
            <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
            <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
            <div className={styles.fields}>
              <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
              <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
            </div>
            <div className={styles.fields}>
              <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
              <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
            </div>
            <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
          </div>
          <div className={styles.right}>
            <div className={styles.total}>
              <h2>Cart Total</h2>
              <div>
                <div className={styles.details}>
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className={styles.details}>
                  <p>Delivery Fee</p>
                  <p>${getTotalCartAmount() === 0 ? "0" : "2"}</p>
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
                  <p>${getTotalCartAmount() === 0 ? "0" : getFinalTotal()}</p>
                </div>
              </div>

              <div className={styles.promo}>
                <p>If you have a promo code, enter it here</p>
                <div className={styles.promoinput}>
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={appliedPromo}
                  />
                  {appliedPromo ? (
                    <button type="button" onClick={removePromoCode} className={styles.removeBtn}>
                      Remove
                    </button>
                  ) : (
                    <button type="button" onClick={applyPromoCode}>Apply</button>
                  )}
                </div>
                {appliedPromo && (
                  <p className={styles.appliedPromo}>
                    ✓ Promo code "{appliedPromo}" applied! You saved ${discount}
                  </p>
                )}
              </div>

              <button type="submit">PLACE ORDER</button>
            </div>
          </div>
        </form>
    </div>
  );
};

export default Order;
