import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { getApiError } from "./api";
import Logo from "./Logo";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/login/", {
        email,
        password,
      });

      const { user, token } = response.data;

      if (!user || !token) {
        setError("Invalid server response.");
        return;
      }

      // Save authentication information
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect after successful login
      navigate("/Home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(getApiError(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 440, width: "100%" }}>
        <div className="text-center mb-4">
          <Link to="/" className="auth-logo" aria-label="Unify home">
            <Logo />
          </Link>
          <h3 className="mb-1">Welcome back</h3>
          <p className="text-muted small mb-0">Log in to continue to your dashboard</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label small fw-semibold">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label small fw-semibold">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-end mb-4">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="btn btn-link p-0 text-decoration-none small"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-muted small mt-4 mb-0">
          Don't have an account?{" "}
          <Link to="/signup" className="fw-semibold text-decoration-none">
            Create a new account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
