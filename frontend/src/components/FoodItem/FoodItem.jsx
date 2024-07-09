import PropTypes from "prop-types";
import { assets } from "../../assets/assets";
import styles from "./FoodItem.module.scss";
import { useContext} from "react";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ name, id, image, description, price }) => {
  
  const {cartItems, addtocart, removefromcart} = useContext(StoreContext);
  const url = "http://localhost:3000"

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={url+"/images/"+image} alt={name} />
      {!cartItems[id]?
          <img src={assets.add_icon_white} onClick={()=>addtocart(id)} className={styles.addtocart}/>
          :<div className={styles.counter}>
              <img src={assets.remove_icon_red} onClick={()=>removefromcart(id)}/>
              <p>{cartItems[id]}</p>
              <img src={assets.add_icon_green} onClick={()=>addtocart(id)}/>
          </div>
      }
      </div>
      <div className={styles.info}>
        <div className={styles.rating}>
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating stars" />
        </div>
        <p className={styles.description}>{description}</p>
        <p className={styles.price}>${price}</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default FoodItem;
