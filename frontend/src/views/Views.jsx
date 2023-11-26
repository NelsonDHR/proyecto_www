import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./Auth/LogIn";
import SignUp from "./Auth/SignUp";
import Home from "./Home";
import ContactsView from "./Contacts/ContactsView";
import EventsView from "./Events/EventsView";
import ActivitiesView from "./Activities/ActivitiesView";
import Profile from "./Profile/Profile";

const Views = () => {

  const PrivateRoute = ({children}) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    return isAuthenticated ? children : <Navigate to="/log-in" />;
  };

  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="*" element={<LogIn />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>} />
      <Route path="/contacts" element={<PrivateRoute> <ContactsView /> </PrivateRoute>} />
      <Route path="/events" element={<PrivateRoute> <EventsView /> </PrivateRoute>} />
      <Route path="/activities" element={<PrivateRoute> <ActivitiesView /> </PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
    </Routes>
  );
};

export default Views;
