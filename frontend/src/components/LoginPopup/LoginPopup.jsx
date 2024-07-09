import { useContext, useState } from "react"
import styles from "./LoginPopup.module.scss"
import { assets } from "../../assets/assets"
import { StoreContext } from "../../context/StoreContext"
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

  const {url, token, setToken} = useContext(StoreContext)

  const [currState,setCurrState]=useState("login")

  const [data, setData] = useState({
    name:"",
    email: "",
    password: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data, [name]:value}))
  }

  const onLogin = async (event) => {
    event.preventDefault();
    let newURL = url;
    if(currState==="login"){
      newURL+="/api/user/login"
    }
    else{
      newURL+="/api/user/register"
    }
    const response = await axios.post(newURL, data);
    if(response.data.success){
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token)
      setShowLogin(false)
    }
    else{
      alert(response.data.message)
    }

  }

  return (
    <div className={styles.container}>
        <form onSubmit={onLogin}>
          <div className={styles.title}>
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
          </div>
          <div className={styles.inputs}>
            {currState==="login"?<></>:<input type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder="your name" required />}
            <input type="email" name="email" value={data.email} onChange={onChangeHandler} placeholder="your email" required />
            <input type="password" name="password" value={data.password} onChange={onChangeHandler} placeholder="your password" required />
          </div>
          <button type="submit">{currState==="sign up"?"create account":"login"}</button>
        <div className={styles.condition}>
          <input type="checkbox" required id="" />
          <p>by continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="login"?
        <p>create a new account? <span onClick={()=>setCurrState("sign up")}>click here</span> </p>
        :<p>already have an account? <span onClick={()=>setCurrState("login")}>login here</span> </p>
        }
        </form>
    </div>
  )
}

export default LoginPopup