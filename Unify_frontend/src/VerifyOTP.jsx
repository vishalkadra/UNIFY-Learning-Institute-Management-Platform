import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";
import API, { getApiError } from "./api";


function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get email from location state (passed from Signup) or fallback to localStorage
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/otp/verify/", { email, code: otp });
      // Account is created by the backend only after successful OTP verification.
      navigate("/login", { state: { message: "Email verified. You can now log in." } });
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Invalid OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form
        onSubmit={handleSubmit}
        className="form-card"
        style={{ maxWidth: "440px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <span className="icon-badge icon-badge--lg auth-card-icon" aria-hidden="true">
            <MailCheck size={30} />
          </span>
          <h3 className="mb-1">Verify OTP</h3>
          <p className="text-muted small mb-0">{email}</p>
        </div>

        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

        <div className="mb-4">
          <label htmlFor="otp" className="form-label">
            OTP
          </label>
          <input
            id="otp"
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control form-control-lg text-center"
            style={{ letterSpacing: "0.4em", fontWeight: 700 }}
            autoComplete="one-time-code"
            placeholder="Enter OTP"
            maxLength={6}
            inputMode="numeric"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

export default VerifyOTP;