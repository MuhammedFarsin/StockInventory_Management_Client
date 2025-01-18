import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function ProtectedAuth({ children }) {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.user);

  if (auth) {
    if (user.user.role === "admin") {
      return <Navigate to={"/admin/dashboard"} />;
    } else {
      return <Navigate to={"/home"} />;
    }
  }

  return children;
}

export default ProtectedAuth;
