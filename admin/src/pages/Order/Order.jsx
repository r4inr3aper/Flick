import { useState, useEffect } from 'react';
import styles from './Order.module.scss';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");

      if (response.data && response.data.success) {
        const ordersData = response.data.data || [];
        // Sort orders by date in descending order (newest first)
        const sortedOrders = ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
        if (sortedOrders.length === 0) {
          toast.info("No orders found");
        }
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);

      if (error.response) {
        toast.error(`Unable to load orders (${error.response.status})`);
      } else if (error.request) {
        toast.error("Unable to connect to server");
      } else {
        toast.error("Failed to load orders");
      }
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      toast.info("Updating order status...");
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: newStatus
      });
      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        await fetchAllOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Unable to update order status");
      console.error("Status update error:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Orders Management</h1>
        <p>Manage and track all customer orders (latest first)</p>
      </div>

      <div className={styles.ordersList}>
        {orders.length === 0 ? (
          <div className={styles.noOrders}>
            <h3>No orders found</h3>
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={order._id || index} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3>Order #{order._id?.slice(-8) || 'N/A'}</h3>
                  <span className={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className={styles.orderAmount}>
                  <span className={styles.amount}>${order.amount}</span>
                  <span className={styles.itemCount}>{order.items.length} items</span>
                </div>
              </div>

              <div className={styles.orderContent}>
                <div className={styles.customerInfo}>
                  <h4>Customer</h4>
                  <p className={styles.customerName}>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className={styles.customerPhone}>{order.address.phone}</p>
                  <p className={styles.customerAddress}>
                    {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}
                  </p>
                </div>

                <div className={styles.orderItems}>
                  <h4>Items</h4>
                  <div className={styles.itemsList}>
                    {order.items.map((item, idx) => (
                      <span key={idx} className={styles.itemChip}>
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.statusSection}>
                  <h4>Status</h4>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className={styles.statusSelect}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;