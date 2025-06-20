import styles from "./Sidebar.module.scss";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.options}>
        <NavLink
          to="/add"
          className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option}
        >
          <img src={assets.add_icon} alt="add" />
          <p>add items</p>
        </NavLink>
        <NavLink
          to="/list"
          className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option}
        >
          <img src={assets.order_icon} alt="list" />
          <p>list items</p>
        </NavLink>
        <NavLink
          to="/order"
          className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option}
        >
          <img src={assets.order_icon} alt="order" />
          <p>orders</p>
        </NavLink>
        <NavLink
          to="/promo"
          className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option}
        >
          <img src={assets.add_icon} alt="promo" />
          <p>promo codes</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
