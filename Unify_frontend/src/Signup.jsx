import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { getApiError } from "./api";
import Logo from "./Logo";


function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("register/", {
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
        password2: form.password2,
      });

      if (!response.data?.email) {
        throw new Error("OTP request response did not include an email address.");
      }

      // Do not save a user/token until the email OTP is verified.
      navigate("/verify-otp", { state: { email: response.data.email } });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response ? getApiError(err, "Registration failed.") : (err.message || "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="form-card" style={{ maxWidth: 460, width: "100%" }} onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <Link to="/" className="auth-logo" aria-label="Unify home">
            <Logo />
          </Link>
          <h3 className="mb-1">Create your account</h3>
          <p className="text-muted small mb-0">Join Unify to explore courses & track your placements</p>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="form-control"
              placeholder="First name"
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Last name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="form-control"
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Confirm password</label>
            <input
              type="password"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              className="form-control"
              placeholder="Re-enter password"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" disabled={loading}>
          {loading ? "Registering..." : "Get OTP"}
        </button>

        <p className="text-center text-muted small mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-decoration-none">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;