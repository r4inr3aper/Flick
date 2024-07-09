import { useEffect, useState } from "react";
import styles from "./List.module.scss";
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const url = "http://localhost:3000";
  const [list, setList] = useState([]);

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      toast.error("An error occurred while removing the food item");
      console.error("Remove Food Error:", error);
    }
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        console.log(response.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the food list");
      console.error("Fetch List Error:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className={`${styles.list} ${styles.add} ${styles.flexcol}`}>
      <p>all foods list</p>
      <div className={styles.table}>
        <div className={`${styles.items} ${styles.title}`}>
          <b>image</b>
          <b>name</b>
          <b>category</b>
          <b>price</b>
          <b>remove</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className={styles.items}>
            <img src={`${url}/images/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeFood(item._id)} className={styles.cursor}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
