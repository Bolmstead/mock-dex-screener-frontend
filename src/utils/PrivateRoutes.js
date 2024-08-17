import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../UserContext.js";

// Prevents a non-loggedin user from accessing certain pages
const PrivateRoutes = () => {
  const { loggedInUser } = useContext(UserContext);

  return loggedInUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
