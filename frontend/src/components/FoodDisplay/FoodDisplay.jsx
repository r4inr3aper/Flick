import { useContext } from "react";
import styles from "./FoodDisplay.module.scss";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import PropTypes from "prop-types"

const FoodDisplay = ({category}) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className={styles.container} id="food_display">
      <h2>Top dishes near you</h2>
      <div className={styles.list}>
      {food_list.map((item, index) => {
        if(category==="All" || category===item.category){
          return (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
            description={item.description}
          />
        );
        }
      })}
      </div>
    </div>
  );
};

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay;
