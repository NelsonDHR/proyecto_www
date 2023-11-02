import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import LogIn from "./Auth/LogIn";
import SignUp from "./Auth/SignUp";
import Home from "./Home";
import Events from "./Events/Events";
import Activities from "./Activities/Activities";

const Views = () => {

  const PrivateRoute = ({children}) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    return isAuthenticated ? children : <Navigate to="/log-in" />;
  };

  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>} />
      <Route path="/events" element={<PrivateRoute> <Events /> </PrivateRoute>} />
      <Route path="/activities" element={<PrivateRoute> <Activities /> </PrivateRoute>} />
    </Routes>
  );
};

export default Views;
