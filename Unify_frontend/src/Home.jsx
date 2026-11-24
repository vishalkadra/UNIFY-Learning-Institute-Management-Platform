import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API, { getApiError } from "./api";
import StudentHome from "./StudentHome";


function Home() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // Keep localStorage in sync with the latest server data,
        // so is_staff is always up to date on this device.
        localStorage.setItem("medata", response.data.id);
        localStorage.setItem("user", JSON.stringify(response.data));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("medata");
        }
        setError(true);
        setLoading(false);
      });
  }, [token]);

  // No token at all -> go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border" style={{ color: "var(--accent)" }} role="status" />
        <p className="text-muted mt-3 mb-0">Loading your dashboard…</p>
      </div>
    );
  }

  if (error) {
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(localStorage.getItem("user") || "null");

  // Superusers get the full admin hub, staff get the staff hub,
  // everyone else gets the student view.
  if (userData?.is_superuser) {
    return <Navigate to="/admin" replace />;
  }

  if (userData?.is_staff) {
    return <Navigate to="/DashBoard" replace />;
  }

  return <StudentHome user={userData} />;
}

export default Home;
