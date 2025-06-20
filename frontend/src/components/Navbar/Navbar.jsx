import { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.scss";
import PropTypes from "prop-types";
import { StoreContext } from "../../context/StoreContext"; // Correct import for context

const Navbar = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, setToken, clearCartOnLogout } = useContext(StoreContext); // Use token and setToken from context
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update active menu based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setMenu("home");
    } else if (path === '/MyOrders') {
      setMenu("orders");
    } else if (path === '/contact') {
      setMenu("contact");
    } else if (path === '/search') {
      setMenu("search");
    } else if (path === '/Cart') {
      setMenu("cart");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    clearCartOnLogout();
    navigate("/");
  };

  const handleNavigation = (section, menuName) => {
    setMenu(menuName || section);
    setShowMobileMenu(false); // Close mobile menu
    if (window.location.pathname !== '/') {
      // If not on home page, navigate to home first
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on home page, just scroll
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMenuClick = (menuName) => {
    setMenu(menuName);
    setShowMobileMenu(false); // Close mobile menu
  };

  const handleSearchIconClick = () => {
    // Always redirect to search page
    navigate('/search');
  };

  return (
    <div className={styles.navbar}>
      <Link to="/" className={styles.logoLink}>
        <div className={styles.logo}>
          <h1>Flick</h1>
        </div>
      </Link>
      <ul className={styles.menu}>
        <li>
          <Link
            to="/"
            className={menu === "home" ? styles.active : ""}
            onClick={() => handleMenuClick("home")}
          >
            home
          </Link>
        </li>
        <li
          className={menu === "menu" ? styles.active : ""}
          onClick={() => handleNavigation("explore-menu", "menu")}
        >
          <span style={{ cursor: 'pointer' }}>menu</span>
        </li>
        {token ? (
          <li>
            <Link
              to="/MyOrders"
              className={menu === "orders" ? styles.active : ""}
              onClick={() => handleMenuClick("orders")}
            >
              my orders
            </Link>
          </li>
        ) : (
          <li
            className={menu === "about" ? styles.active : ""}
            onClick={() => handleNavigation("about", "about")}
          >
            <span style={{ cursor: 'pointer' }}>about us</span>
          </li>
        )}
        <li>
          <Link
            to="/contact"
            className={menu === "contact" ? styles.active : ""}
            onClick={() => handleMenuClick("contact")}
          >
            contact us
          </Link>
        </li>
      </ul>

      <div className={styles.right}>
        <div className={styles.searchContainer}>
          <img
            src={assets.search_icon}
            alt="search"
            onClick={handleSearchIconClick}
            className={styles.searchIcon}
            title="Search food items"
          />
        </div>
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
            <img
              src={assets.profile_icon}
              alt="profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            <ul className={showProfileMenu ? styles.showMobile : ''}>
              <li onClick={() => {
                navigate('/MyOrders');
                setShowProfileMenu(false);
              }}>
                <img src={assets.bag_icon} alt="orders" />
                <p>orders</p>
              </li>
              <hr />
              <li onClick={() => {
                handleLogout();
                setShowProfileMenu(false);
              }}>
                <img src={assets.logout_icon} alt="logout" />
                <p>logout</p>
              </li>
            </ul>
          </div>
        )}

        {/* Mobile Menu Toggle - moved inside right section */}
        <div className={styles.mobileMenuToggle} onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={styles.mobileMenu}>
          <ul>
            <li className={menu === "home" ? styles.active : ""}>
              <Link
                to="/"
                onClick={() => handleMenuClick("home")}
              >
                home
              </Link>
            </li>
            <li
              className={menu === "menu" ? styles.active : ""}
              onClick={() => handleNavigation("explore-menu", "menu")}
            >
              <span>menu</span>
            </li>
            {token ? (
              <li className={menu === "orders" ? styles.active : ""}>
                <Link
                  to="/MyOrders"
                  onClick={() => handleMenuClick("orders")}
                >
                  my orders
                </Link>
              </li>
            ) : (
              <li
                className={menu === "about" ? styles.active : ""}
                onClick={() => handleNavigation("about", "about")}
              >
                <span>about us</span>
              </li>
            )}
            <li className={menu === "contact" ? styles.active : ""}>
              <Link
                to="/contact"
                onClick={() => handleMenuClick("contact")}
              >
                contact us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Navbar;
