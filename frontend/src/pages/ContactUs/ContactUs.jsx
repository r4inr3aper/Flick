import styles from './ContactUs.module.scss';

const ContactUs = () => {

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Contact Us</h1>
        <p>Get in touch with us for any questions or support</p>
      </div>

      <div className={styles.content}>
        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <div className={styles.icon}>📍</div>
            <div>
              <h3>Address</h3>
              <p>123 Food Street, Flavor City, FC 12345</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.icon}>📞</div>
            <div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.icon}>✉️</div>
            <div>
              <h3>Email</h3>
              <p>hello@flick.com</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.icon}>🕒</div>
            <div>
              <h3>Hours</h3>
              <p>Mon - Sun: 9:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
