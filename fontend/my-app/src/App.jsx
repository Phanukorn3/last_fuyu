import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Navbaruser from "./components/Navbaruser";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"


function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
    </>
  );
}
function LayoutWithNavbaruser() {
  return (
    <>
      <Navbaruser />
      <div className="p-6">
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<LayoutWithNavbar />} />
        <Route path="/user/*" element={<LayoutWithNavbaruser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}