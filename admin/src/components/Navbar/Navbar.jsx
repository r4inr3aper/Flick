import styles from './Navbar.module.scss'
import {assets} from "../../assets/assets.js"

const Navbar = () => {
  return (
    <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Flick</h1>
          <span>Admin</span>
        </div>
        <img className={styles.profile} src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar