import styles from './Navbar.module.scss'
import {assets} from "../../assets/assets.js"

const Navbar = () => {
  return (
    <div className={styles.container}>
        <img className={styles.logo} src={assets.logo} alt="" />
        <img className={styles.profile} src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar