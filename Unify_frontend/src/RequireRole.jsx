import { Navigate } from "react-router-dom";

// Wrap any page: <RequireRole role="staff"><DashBoard /></RequireRole>
// role="staff"     -> allows is_staff OR is_superuser
// role="superuser" -> allows is_superuser only
function RequireRole({ role, children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role === "superuser" && !user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  if (role === "staff" && !(user.is_staff || user.is_superuser)) {
    return <Navigate to="/" replace />;
  }

  if (role === "student" && (user.is_staff || user.is_superuser)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireRole;
