import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

// Shows the page only for a logged-in user. Otherwise redirects to /login and remembers where they wanted to go.
function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default ProtectedRoute;
