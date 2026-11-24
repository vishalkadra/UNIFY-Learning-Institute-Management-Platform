
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import API, { getApiError } from "./api";


function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send OTP to the backend
      await API.post("/forgot-password/", { email });
      // OTP sent successfully → navigate to VerifyOTP page, passing email
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="form-card" style={{ maxWidth: "440px", width: "100%" }} onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <span className="icon-badge icon-badge--lg auth-card-icon" aria-hidden="true">
            <KeyRound size={30} />
          </span>
          <h3 className="mb-1">Forgot Password</h3>
          <p className="text-muted small mb-0">Enter your email to receive an OTP</p>
        </div>

        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-control"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;