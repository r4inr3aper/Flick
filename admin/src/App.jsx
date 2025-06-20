import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Order from './pages/Order/Order'
import Promo from './pages/Promo/Promo'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <div className="appcontent" style={{
        display: "flex",
        marginTop: "60px"
      }} id="app-content">
        <Sidebar />
        <div style={{
          marginLeft: "max(15vw, 200px)",
          width: "calc(100% - max(15vw, 200px))",
          minHeight: "calc(100vh - 60px)",
          overflowX: "auto"
        }} className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<Add/>}></Route>
            <Route path="/list" element={<List/>}></Route>
            <Route path="/order" element={<Order/>}></Route>
            <Route path="/promo" element={<Promo/>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App