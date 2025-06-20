import { useState, useEffect, useContext } from "react";
import styles from "./MyOrders.module.scss";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { token, url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      
      if (response.data.success) {
        const ordersData = response.data.data || [];
        // Sort orders by date in descending order (newest first)
        const sortedOrders = ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } else {
        toast.error("Error fetching orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'food processing':
        return '#fff3cd';
      case 'out for delivery':
        return '#cce5ff';
      case 'delivered':
        return '#d4edda';
      default:
        return '#f0f0f0';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status.toLowerCase()) {
      case 'food processing':
        return '#856404';
      case 'out for delivery':
        return '#004085';
      case 'delivered':
        return '#155724';
      default:
        return '#333';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <h2>Loading your orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Orders</h1>
        <p>Track your order status and view order history (latest first)</p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.noOrders}>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/')} className={styles.shopBtn}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order, index) => (
            <div key={order._id || index} className={styles.orderItem}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3>#{order._id?.slice(-8) || 'N/A'}</h3>
                  <p className={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div
                  className={styles.status}
                  style={{
                    backgroundColor: getStatusColor(order.status),
                    color: getStatusTextColor(order.status)
                  }}
                >
                  {order.status}
                </div>
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.orderSummary}>
                  <div className={styles.summaryItem}>
                    <span className={styles.label}>Items:</span>
                    <span className={styles.value}>{order.items?.length || 0}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.label}>Total:</span>
                    <span className={styles.value}>${order.amount}</span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  <h4>Items:</h4>
                  <div className={styles.itemsList}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className={styles.orderItemDetail}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                        <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    )) || <span className={styles.noItems}>No items</span>}
                  </div>
                </div>

                {order.address && (
                  <div className={styles.deliveryAddress}>
                    <h4>Address:</h4>
                    <p>
                      {order.address.firstName} {order.address.lastName}, {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
