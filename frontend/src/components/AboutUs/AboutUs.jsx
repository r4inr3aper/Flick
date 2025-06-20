import styles from './AboutUs.module.scss';

const AboutUs = () => {
  return (
    <div className={styles.container} id="about">
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Why Choose Flick?</h2>
          <p>We make food delivery simple, fast, and delicious</p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast Delivery</h3>
            <p>30 minutes or less</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🍽️</div>
            <h3>Fresh Food</h3>
            <p>Quality ingredients</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Easy Ordering</h3>
            <p>Simple & intuitive</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>💯</div>
            <h3>Satisfaction</h3>
            <p>100% guaranteed</p>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.number}>10K+</div>
          <div className={styles.label}>Happy Customers</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.number}>500+</div>
          <div className={styles.label}>Restaurant Partners</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.number}>50K+</div>
          <div className={styles.label}>Orders Delivered</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.number}>4.8★</div>
          <div className={styles.label}>Average Rating</div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
