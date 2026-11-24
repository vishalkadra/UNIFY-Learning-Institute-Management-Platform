import { useEffect, useState } from "react";
import API, { getApiError } from "./api";
import {
  Trash2, Plus, Users, GraduationCap, Briefcase, Pencil, X
} from "lucide-react";

function ManageExperts() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const emptyForm = {
    name: "", Qualification: "", role: "", experience: "",
    skills: "", expertise: "", image: null
  };

  const [experts, setExperts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadExperts = async () => {
    try {
      const res = await API.get("/experts/");
      setExperts(res.data);
    } catch (err) {
      setError(getApiError(err, "Could not load experts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperts();
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = e =>
    setForm({ ...form, image: e.target.files[0] });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const data = new FormData();

    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== "")
        data.append(key, form[key]);
    });

    try {
      if (editId) {
        await API.put(`/experts/${editId}/`, data, {
          headers: { ...headers, "Content-Type": "multipart/form-data" }
        });
      } else {
        await API.post("/experts/", data, {
          headers: { ...headers, "Content-Type": "multipart/form-data" }
        });
      }

      setForm(emptyForm);
      setEditId(null);
      setStatus("");
      await loadExperts();
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Could not save expert."));
      setStatus("");
    }
  };

  const handleEdit = expert => {
    setEditId(expert.id);
    setForm({
      name: expert.name || "",
      Qualification: expert.Qualification || "",
      role: expert.role || "",
      experience: expert.experience || "",
      skills: expert.skills || "",
      expertise: expert.expertise || "",
      image: null
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this expert?")) return;

    try {
      await API.delete(`/experts/${id}/`, { headers });
      setExperts(experts.filter(x => x.id !== id));
    } catch (err) {
      setError(getApiError(err, "Could not delete expert."));
    }
  };

  return (
    <>
      <div className="page-hero">
        <div className="container py-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Users size={30} color="white" />
            <div>
              <h1 className="mb-1">Manage Experts</h1>
              <p className="mb-0">Add and manage platform experts</p>
            </div>
          </div>
          <span className="badge">
            Total: {experts.length}
          </span>
        </div>
      </div>

      <div className="container page-body" style={{ maxWidth: 1250 }}>
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-white p-4">
            <h5 className="fw-bold mb-0">
              {editId ? "Edit Expert" : "Add New Expert"}
            </h5>
          </div>

          <div className="card-body p-4">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="row g-3">

              {[
                ["name", "Expert Name"],
                ["Qualification", "Qualification"],
                ["role", "Professional Role"],
                ["experience", "Experience"],
                ["expertise", "Area of Expertise"]
              ].map(([name, label]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    className="form-control"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="col-md-6">
                <label className="form-label fw-semibold">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImage}
                />
                {editId && (
                  <small className="text-muted">
                    Leave empty to keep current image.
                  </small>
                )}
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Skills</label>
                <textarea
                  name="skills"
                  className="form-control"
                  rows="3"
                  value={form.skills}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button
                  className="btn btn-primary px-4"
                  disabled={status === "saving"}
                >
                  {editId ? <Pencil size={17} /> : <Plus size={17} />}
                  {" "}
                  {status === "saving"
                    ? "Saving..."
                    : editId
                    ? "Update Expert"
                    : "Add Expert"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEdit}
                  >
                    <X size={17} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="fw-bold">Expert Directory</h4>
          <p className="text-muted">View and manage all experts</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : experts.length === 0 ? (
          <div className="empty-state">
            <Users size={45} className="text-muted mb-2" aria-hidden="true" />
            <h5>No Experts Available</h5>
          </div>
        ) : (
          <div className="row g-4">
            {experts.map(expert => (
              <div className="col-md-6 col-lg-4" key={expert.id}>
                <div className="card border-0 shadow-sm h-100 overflow-hidden">

                  {expert.image ? (
                    <img
                      src={
                        expert.image.startsWith("http")
                          ? expert.image
                          : `http://127.0.0.1:8000${expert.image}`
                      }
                      alt={expert.name}
                      style={{
                        height: 230,
                        width: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-light"
                      style={{ height: 230 }}
                    >
                      <Users size={60} className="text-muted" />
                    </div>
                  )}

                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="fw-bold mb-1">{expert.name}</h5>
                        <span className="text-primary">
                          {expert.role}
                        </span>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Expert"
                          aria-label="Edit expert"
                          onClick={() => handleEdit(expert)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete Expert"
                          aria-label="Delete expert"
                          onClick={() => handleDelete(expert.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <hr />

                    <p className="mb-2">
                      <GraduationCap size={16} className="text-primary me-2" />
                      <b>Qualification:</b> {expert.Qualification}
                    </p>

                    <p className="mb-2">
                      <Briefcase size={16} className="text-primary me-2" />
                      <b>Experience:</b> {expert.experience}
                    </p>

                    <p className="mb-2">
                      <b>Expertise:</b> {expert.expertise}
                    </p>

                    <p className="mb-0">
                      <b>Skills:</b> {expert.skills}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageExperts;