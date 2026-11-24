import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getApiError } from "./api";

function AddPlacement() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const emptyForm = {
    company_name: "",
    role: "",
    package: "",
    eligibility: "",
    date: "",
    location: "",
    company_description: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [placements, setPlacements] = useState([]);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const loadPlacements = async () => {
    try {
      const { data } = await API.get("/placements/");
      setPlacements(data);
    } catch (err) {
      setError(getApiError(err, "Could not load placements."));
    }
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      if (editId) {
        await API.patch(`/placements/${editId}/`, form, { headers });
      } else {
        await API.post("/placements/", form, { headers });
      }

      setForm(emptyForm);
      setEditId(null);
      setStatus("sent");
      loadPlacements();
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Could not save the placement."));
      setStatus("error");
    }
  };

  const editPlacement = (item) => {
    setForm({
      company_name: item.company_name || "",
      role: item.role || "",
      package: item.package || "",
      eligibility: item.eligibility || "",
      date: item.date || "",
      location: item.location || "",
      company_description: item.company_description || "",
    });
    setEditId(item.id);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePlacement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this placement?"))
      return;

    try {
      await API.delete(`/placements/${id}/`, { headers });
      setPlacements((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(getApiError(err, "Could not delete placement."));
    }
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditId(null);
    setStatus("idle");
  };

  return (
    <div className="page-body admin-form-page">
      <div className="container" style={{ maxWidth: "1000px" }}>

        {/* FORM */}
        <div className="text-center mb-4">
          <div className="icon-badge icon-badge--lg auth-card-icon" style={{ fontSize: "28px" }} aria-hidden="true">
            💼
          </div>

          <h2 className="mb-2">
            {editId ? "Update Placement Drive" : "Add Placement Drive"}
          </h2>

          <p className="text-muted mb-0">
            {editId
              ? "Edit placement information"
              : "Publish a new placement opportunity for students"}
          </p>
        </div>

        <div className="card form-panel mb-5">
          <div className="form-panel__head">
            <h5 className="mb-1">
              Placement Information
            </h5>
            <small>
              Fill in the details carefully
            </small>
          </div>

          <div className="card-body p-4 p-md-5">
            {status === "sent" && (
              <div className="alert alert-success" role="status">
                ✓ Placement {editId ? "updated" : "published"} successfully.
              </div>
            )}

            {status === "error" && (
              <div className="alert alert-danger" role="alert">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                {[
                  ["company_name", "🏢 Company Name", "e.g. Infosys"],
                  ["role", "👨‍💻 Job Role", "e.g. Software Developer"],
                  ["package", "💰 Package", "e.g. 6 LPA"],
                  ["eligibility", "🎓 Eligibility", "e.g. B.Tech, 60%+"],
                  ["location", "📍 Location", "e.g. Indore"],
                ].map(([name, label, placeholder]) => (
                  <div className="col-md-6 mb-4" key={name}>
                    <label className="form-label" htmlFor={name}>{label}</label>
                    <input
                      type="text"
                      id={name}
                      name={name}
                      className="form-control form-control-lg"
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}

                <div className="col-md-6 mb-4">
                  <label className="form-label" htmlFor="date">
                    📅 Drive Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control form-control-lg"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 mb-4">
                  <label className="form-label" htmlFor="company_description">
                    📝 Company Description
                  </label>
                  <textarea
                    id="company_description"
                    name="company_description"
                    className="form-control"
                    rows="4"
                    placeholder="Company description..."
                    value={form.company_description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-3">
                {editId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg w-50"
                    onClick={cancelEdit}
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Saving..."
                    : editId
                    ? "Update Placement"
                    : "Publish Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SHOW DATA */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">📋 Placement Data</h3>
          <span className="badge bg-primary">
            {placements.length} Drives
          </span>
        </div>

        {placements.length === 0 ? (
          <div className="alert alert-info text-center">
            No placement data available.
          </div>
        ) : (
          <div className="row g-4">
            {placements.map((item) => (
              <div className="col-md-6" key={item.id}>
                <div className="card drive-card h-100">
                  <div className="drive-card__head">
                    <div>
                      <h5 className="mb-1">{item.company_name}</h5>
                      <small>{item.role}</small>
                    </div>
                  </div>

                  <div className="card-body">
                    <p>
                      <strong>💰 Package:</strong> {item.package}
                    </p>

                    <p>
                      <strong>🎓 Eligibility:</strong> {item.eligibility}
                    </p>

                    <p>
                      <strong>📅 Date:</strong> {item.date}
                    </p>

                    <p>
                      <strong>📍 Location:</strong> {item.location}
                    </p>

                    <p className="text-muted mb-0">
                      {item.company_description}
                    </p>
                  </div>

                  <div className="card-footer bg-white border-0 d-flex gap-2 pb-4 px-4">
                    <button
                      className="btn btn-outline-warning w-50"
                      onClick={() => editPlacement(item)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="btn btn-outline-danger w-50"
                      onClick={() => deletePlacement(item.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPlacement;
