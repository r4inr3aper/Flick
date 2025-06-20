import { useState } from "react"
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu"
import Header from "../../components/Header/Header"
import styles from "./Home.module.scss"
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay"
import AboutUs from "../../components/AboutUs/AboutUs"

const Home = () => {
   const [category,setCategory]=useState("All");

  return (
    <div className={styles.container}>
        <Header/>
        <div className={styles.content}>
          <ExploreMenu category={category} setCategory={setCategory}/>
          <FoodDisplay category={category} />
        </div>
        <AboutUs/>
    </div>
  )
}

export default Home