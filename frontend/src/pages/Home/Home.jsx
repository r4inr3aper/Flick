import { useState } from "react"
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu"
import Header from "../../components/Header/Header"
import styles from "./Home.module.scss"
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay"
import AppDownload from "../../components/AppDownload/AppDownload"

const Home = () => {
   const [category,setCategory]=useState("All");

  return (
    <div className={styles.container}>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category} />
        <AppDownload/>
    </div>
  )
}

export default Home