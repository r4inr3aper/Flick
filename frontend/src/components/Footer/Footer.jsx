import { Link } from 'react-router-dom'
import { assets } from "../../assets/assets"
import styles from "./Footer.module.scss"

const Footer = () => {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <h1>Flick</h1>
            <span>Food Delivery</span>
          </div>
          <p>Delicious food delivered fast to your doorstep.</p>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="#explore-menu">Menu</a></li>
            <li><a href="#about">About Us</a></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.services}>
          <h3>Services</h3>
          <ul>
            <li>Fast Delivery</li>
            <li>Online Ordering</li>
            <li>24/7 Support</li>
          </ul>
        </div>

        <div className={styles.right}>
          <h3>Contact</h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.label}>📞 Phone:</span>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.label}>✉️ Email:</span>
              <span>hello@flick.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <p>&copy; 2024 Flick. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Footer