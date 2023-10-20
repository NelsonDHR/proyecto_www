import { Routes, Route } from "react-router-dom";
import LogIn from "./Auth/LogIn";
import SignUp from "./Auth/SignUp";
import Home from "./Home";
import Events from "./Events/Events";
import Activities from "./Activities/Activities";

const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="*" element={<LogIn />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/events" element={<Events />} />
      <Route path="/activities" element={<Activities />} />
    </Routes>
  );
};

export default Views;
