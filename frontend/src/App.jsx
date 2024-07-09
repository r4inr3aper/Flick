import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";

const App = () => {

  const [showLogin,setShowLogin]=useState(false);

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className="app">
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Cart" element={<Cart/>} />
        <Route path="/Order" element={<Order/>} />
      </Routes>
    </div>
      <Footer/>
    </>
  );
};

export default App;
