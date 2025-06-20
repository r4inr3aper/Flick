import { useContext, useState, useEffect } from "react"
import styles from "./LoginPopup.module.scss"
import { assets } from "../../assets/assets"
import { StoreContext } from "../../context/StoreContext"
import { validateLoginForm, validateRegistrationForm, sanitizeInput } from "../../utils/validation"
import { toast } from 'react-toastify'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

  const {url, token, setToken, syncCartOnLogin} = useContext(StoreContext)

  const [currState,setCurrState]=useState("login")

  const [data, setData] = useState({
    name:"",
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = sanitizeInput(event.target.value);
    setData(data=>({...data, [name]:value}))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}))
    }
  }

  const fillGuestCredentials = () => {
    setData({
      ...data,
      email: "guest@gmail.com",
      password: "Password@123"
    });
    // Clear any existing errors
    setErrors({});
    toast.info("Guest credentials filled! Click Login to continue.");
  };

  const onLogin = async (event) => {
    event.preventDefault();

    // Validate form data
    const validation = currState === "login"
      ? validateLoginForm(data)
      : validateRegistrationForm(data);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let newURL = url;
      if(currState==="login"){
        newURL+="/api/user/login"
      }
      else{
        newURL+="/api/user/register"
      }

      const response = await axios.post(newURL, data);

      if(response.data.success){
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);

        // Sync cart when user logs in
        if (currState === "login") {
          await syncCartOnLogin(newToken);
        }

        setShowLogin(false);
        toast.success(currState === "login" ? "Login successful!" : "Registration successful!");
      }
      else{
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path || 'general'] = err.msg || err;
        });
        setErrors(backendErrors);
      } else {
        toast.error(error.response?.data?.message || "Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
            {currState==="login"?<></>:(
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={onChangeHandler}
                  placeholder="your name"
                  required
                  className={errors.name ? styles.error : ''}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
            )}
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={onChangeHandler}
                placeholder="your email"
                required
                className={errors.email ? styles.error : ''}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={onChangeHandler}
                placeholder="your password"
                required
                className={errors.password ? styles.error : ''}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : (currState==="sign up"?"create account":"login")}
            </button>
            {currState === "login" && (
              <button
                type="button"
                className={styles.guestButton}
                onClick={fillGuestCredentials}
                disabled={isSubmitting}
              >
                👤 Guest Credentials
              </button>
            )}
          </div>
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