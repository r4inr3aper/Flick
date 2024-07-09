import { Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Order from './pages/Order/Order'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="appcontent" style={{"display":"flex"}}>
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add/>}></Route>
          <Route path="/list" element={<List/>}></Route>
          <Route path="/order" element={<Order/>}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App