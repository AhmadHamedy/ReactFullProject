import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Food from "./Pages/Food";
import Login from "./Pages/login"; // Ensure lowercase 'l' matches your file
import Drinks from "./Pages/Drinks";
import MenuDetails from "./Pages/MenuDetails";
import Admin from "./Pages/Admin"; // Use Admin to handle the protection logic
import { MenuProvider } from "./Context/MenuContext";

export default function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <div className="app-wrapper">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/food" element={<Food />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/menu/:id" element={<MenuDetails />} />
            {/* Change the route below to Admin */}
            <Route path="/manage" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          <Footer />
        </div>
      </MenuProvider>
    </BrowserRouter>
  );
}