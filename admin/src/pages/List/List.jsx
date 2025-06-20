import { useEffect, useState } from "react";
import styles from "./List.module.scss";
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const url = "https://flick-be.onrender.com";
  const [list, setList] = useState([]);

  const removeFood = async (foodId) => {
    try {
      toast.info("Removing food item...");
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success("Food item removed successfully");
        await fetchList();
      } else {
        toast.error("Failed to remove food item");
      }
    } catch (error) {
      toast.error("Error removing food item");
      console.error("Remove Food Error:", error);
    }
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        if (response.data.data.length === 0) {
          toast.info("No food items found");
        }
      } else {
        toast.error("Failed to load food items");
      }
    } catch (error) {
      toast.error("Unable to connect to server");
      console.error("Fetch List Error:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Food Items Management</h1>
        <p>Manage all food items in your restaurant (latest first)</p>
      </div>

      <div className={styles.foodList}>
        {list.length === 0 ? (
          <div className={styles.noItems}>
            <h3>No food items found</h3>
            <p>No food items have been added yet.</p>
          </div>
        ) : (
          list.map((item, index) => (
            <div key={item._id || index} className={styles.foodCard}>
              <button
                onClick={() => removeFood(item._id)}
                className={styles.deleteBtn}
                title="Remove item"
              >
                ×
              </button>

              <div className={styles.foodHeader}>
                <div className={styles.foodImage}>
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                </div>
                <div className={styles.foodInfo}>
                  <h3>{item.name}</h3>
                  <span className={styles.category}>{item.category}</span>
                </div>
                <div className={styles.foodPrice}>
                  <span className={styles.price}>${item.price}</span>
                </div>
              </div>

              <div className={styles.foodContent}>
                <div className={styles.foodDetails}>
                  <h4>Description</h4>
                  <p>{item.description || 'No description available'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
