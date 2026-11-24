import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import API, { getApiError } from "./api";


function ComplaintForm({ type, heading, onBack }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");



  const [form, setForm] = useState({ name: "", email: "", contact: "", problem: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  // Logged-in user ka data localStorage se le aao
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setForm((prev) => ({
          ...prev,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || prev.name,
          email: user.email || "",
        }));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
  }, []);

  // Not logged in -> can't file a complaint
  if (!token || !currentUser) {
    return (
      <div className="container page-body">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 text-center">
            <div className="form-card">
              <h4 className="mb-2">Please log in to continue</h4>
              <p className="text-muted mb-4">
                You need to be logged in as a student to submit a complaint or query.
              </p>
              <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>
                Log in
              </button>
              <button className="btn btn-outline-secondary" onClick={onBack}>
                Back to support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Staff / superuser accounts can't file complaints
  if (currentUser.is_staff || currentUser.is_superuser) {
    return (
      <div className="container page-body">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 text-center">
            <div className="form-card">
              <h4 className="mb-2">Not available for staff accounts</h4>
              <p className="text-muted mb-4">
                Staff and admin accounts cannot submit complaints or queries. If you're
                facing an issue, please coordinate with another team member directly.
              </p>
              <button className="btn btn-outline-secondary" onClick={onBack}>
                Back to support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/queries/",
        { type, ...form },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setStatus("sent");
      setForm((prev) => ({ ...prev, contact: "", problem: "" })); // name/email rakhe rehne do
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Could not submit your query."));
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="container page-body">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 text-center">
            <div className="alert alert-success" role="status">
              Your query has been submitted. Our team will get back to you soon.
            </div>
            <button className="btn btn-outline-secondary" onClick={onBack}>
              Back to support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-body">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="form-card">
            <h2 className="text-center mb-2">{heading}</h2>
            <p className="text-center text-muted mb-4">
              Please fill in the details below and submit your query.
            </p>

            {status === "error" && (
              <div className="alert alert-danger" role="alert">
                {error || "Could not submit your query. Please try again."}
              </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Your login email"
                    value={form.email}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="contact" className="form-label">Contact number</label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    className="form-control"
                    placeholder="Enter your contact number"
                    value={form.contact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="problem" className="form-label">Problem in brief</label>
                  <textarea
                    id="problem"
                    name="problem"
                    className="form-control"
                    rows="4"
                    placeholder="Describe your problem briefly"
                    value={form.problem}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                    {status === "sending" ? "Submitting..." : "Submit query"}
                  </button>
                  <button type="button" className="btn btn-link" onClick={onBack}>
                    Back to support
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintForm;