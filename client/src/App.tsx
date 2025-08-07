import Navbar from "./components/Navbar";
import AnimatedWeather from "./components/AnimatedWeather";
import WeatherData from "./components/WeatherData";
import { CityProvider } from "./components/CityContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MoreInfo from "./pages/MoreInfo";
import Home from "./pages/Home";

const App = () => {
  return (
      <CityProvider>
      
{/* <Home/> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/more-info" element={<MoreInfo />} />
        </Routes>
      </CityProvider>
  );
};

export default App;
