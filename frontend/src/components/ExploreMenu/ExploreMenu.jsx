import { menu_list } from "../../assets/assets";
import styles from "./ExploreMenu.module.scss";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div id="menu" className={styles.container}>
      <h1>Explore our menu</h1>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium ea eveniet optio molestias voluptates at?</p>
      <div className={styles.list}>
        {menu_list.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
              className={styles.menu}
            >
              <img
                className={category === item.menu_name ? styles.active : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
