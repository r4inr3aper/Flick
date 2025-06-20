import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import MyOrders from "./pages/MyOrders/MyOrders";
import ContactUs from "./pages/ContactUs/ContactUs";
import Search from "./pages/Search/Search";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <Route path="/MyOrders" element={<MyOrders/>} />
        <Route path="/contact" element={<ContactUs/>} />
        <Route path="/search" element={<Search/>} />
      </Routes>
    </div>
      <Footer/>
      <ToastContainer />
    </>
  );
};

export default App;
