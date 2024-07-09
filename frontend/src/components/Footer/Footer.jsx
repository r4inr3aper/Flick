import { assets } from "../../assets/assets"
import styles from "./Footer.module.scss"

const Footer = () => {
  return (
    <>
    <div className={styles.container}>
        <div id="#contact-us" className={styles.left}>
            <img src={assets.logo} alt=""/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, vero iure. Sint dignissimos illo cum culpa adipisci suscipit deleniti, molestiae quaerat enim numquam reiciendis mollitia.</p>
            <div className={styles.icons}>
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className={styles.center}>
                <h2>COMPANY</h2>
                <ul>
                    <li>home</li>
                    <li>about us</li>
                    <li>delivery</li>
                    <li>privacy policy</li>
                </ul>
        </div>
        <div className={styles.right}>
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-9876543210</li>
                <li>contact@tomato.com</li>
            </ul>
        </div>
    </div>
        {/* <hr /> */}
        {/* <p className={styles.copyright}>All Rights Reserved</p> */}
    </>
  )
}
export default Footer