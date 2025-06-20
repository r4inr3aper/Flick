import { useContext } from "react";
import styles from "./FoodDisplay.module.scss";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import PropTypes from "prop-types"

const FoodDisplay = ({category}) => {
  const { food_list, isLoading } = useContext(StoreContext);

  // Filter food items based on category only
  const filteredFoodList = food_list.filter((item) => {
    return category === "All" || category.toLowerCase() === item.category.toLowerCase();
  });

  if (isLoading) {
    return (
      <div className={styles.container} id="food_display">
        <h2>Top dishes near you</h2>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading delicious food items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} id="food_display">
      <h2>Top dishes near you</h2>
      <div className={styles.list}>
      {filteredFoodList.length > 0 ? (
        filteredFoodList.map((item, index) => (
          <FoodItem
            key={item._id || index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
            description={item.description}
          />
        ))
      ) : (
        <p>No items found for this category.</p>
      )}
      </div>
    </div>
  );
};

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay;
