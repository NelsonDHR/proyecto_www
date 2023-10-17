import { Routes, Route } from "react-router-dom";
import LogIn from "./Auth/LogIn";
import SignUp from "./Auth/SignUp";
import Home from "./Home";

const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="*" element={<LogIn />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
};

export default Views;
