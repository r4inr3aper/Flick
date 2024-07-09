import styles from "./Header.module.scss"

const Header = () => {
  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <h2>Order your favourite food here.</h2>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque inventore earum nulla quia molestiae est aperiam culpa magni delectus impedit.</p>
            <button>View Menu</button>
        </div>
    </div>
  )
}

export default Header