import PropTypes from "prop-types";
import { assets } from "../../assets/assets";
import styles from "./FoodItem.module.scss";
import { useContext} from "react";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ name, id, image, description, price }) => {

  const {cartItems, addtocart, removefromcart, url} = useContext(StoreContext);

  // Handle both static images (imported) and backend images (filename strings)
  const getImageSrc = () => {
    // If image is a string (backend data), construct URL
    if (typeof image === 'string') {
      return url + "/images/" + image;
    }
    // If image is an imported object (static data), use it directly
    return image;
  };

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={getImageSrc()} alt={name} />
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
