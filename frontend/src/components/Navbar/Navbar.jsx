import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import PropTypes from "prop-types";
import { StoreContext } from "../../context/StoreContext"; // Correct import for context

const Navbar = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext); // Use token and setToken from context
  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/")
  };

  return (
    <div className={styles.navbar}>
      <Link to="/">
        <img src={assets.logo} alt="logo" className={styles.logo} />
      </Link>
      <ul className={styles.menu}>
        <Link to="/" className={menu === "home" ? styles.active : ""} onClick={() => setMenu("home")}>
          home
        </Link>
        <a href="#menu" className={menu === "menu" ? styles.active : ""} onClick={() => setMenu("menu")}>
          menu
        </a>
        <a href="#mobile-app" className={menu === "mobile-app" ? styles.active : ""} onClick={() => setMenu("mobile-app")}>
          mobile-app
        </a>
        <a href="#contact-us" className={menu === "contact" ? styles.active : ""} onClick={() => setMenu("contact")}>
          contact us
        </a>
      </ul>
      <div className={styles.right}>
        <img src={assets.search_icon} alt="search" />
        <Link to="/Cart">
          <div className={styles.cart}>
            <img src={assets.basket_icon} alt="basket" />
            <div className={getTotalCartAmount() === 0 ? "" : styles.dot}></div>
          </div>
        </Link>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className={styles.profile}>
            <img src={assets.profile_icon} alt="profile" />
            <ul>
              <li>
                <img src={assets.bag_icon} alt="orders" />
                <p>orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="logout" />
                <p>logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Navbar;
