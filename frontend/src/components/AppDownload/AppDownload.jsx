import { assets } from "../../assets/assets"
import styles from "./AppDownload.module.scss"
const AppDownload = () => {
  return (
    <div id="#mobile-app" className={styles.container}>
        <p>For Better Experience Download <br /> Tomato App</p>
        <div className={styles.icons}>
            <img src={assets.play_store} alt="" />
            <img src={assets.app_store} alt="" />
        </div>
    </div>
  )
}

export default AppDownload