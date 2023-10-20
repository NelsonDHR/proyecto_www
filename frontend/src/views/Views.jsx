import { Routes, Route, useNavigate } from "react-router-dom";
import LogIn from "./Auth/LogIn";
import SignUp from "./Auth/SignUp";
import Home from "./Home";
import Events from "./Events/Events";
import Activities from "./Activities/Activities";

const Views = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const navigateTo = useNavigate();

  if (!isAuthenticated) {
    navigateTo('/log-in');
  }

  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      {/* {isAuthenticated ? (
        <>
          <Route path="/home" element={<Home />} />
        </>
      ) : (
        navigateTo('/log-in')
      )} */}
      <Route path="/events" element={<Events />} />
      <Route path="/activities" element={<Activities />} />
    </Routes>
  );
};

export default Views;
