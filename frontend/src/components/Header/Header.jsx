import styles from "./Header.module.scss"

const Header = () => {
  const handleViewMenu = () => {
    document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <h2>Order your favourite food here.</h2>
            <p>Discover delicious meals from top restaurants in your area. Fresh ingredients, fast delivery, and unbeatable taste - all at your fingertips with Flick.</p>
            <button onClick={handleViewMenu}>View Menu</button>
        </div>
        <div className={styles.foodImage}></div>
    </div>
  )
}

export default Header