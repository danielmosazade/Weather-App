import { CityProvider } from "./components/CityContext";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MoreInfo from "./pages/MoreInfo";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
      <CityProvider>
         <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/more-info" element={<MoreInfo />} />
          <Route path="/admin-page" element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>} />
        </Routes>
      </CityProvider>
  );
};

export default App;
