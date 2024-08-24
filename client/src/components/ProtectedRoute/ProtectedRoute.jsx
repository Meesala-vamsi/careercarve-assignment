import { Navigate, Outlet } from "react-router-dom";
import cookies from "js-cookie";

const ProtectedRoute = ({ isAuthRoute }) => {
  const token = cookies.get("token");

  if (isAuthRoute) {
    return token ? <Navigate to="/" /> : <Outlet />;
  } else {
    return token ? <Outlet /> : <Navigate to="/login" />;
  }
};

export default ProtectedRoute;