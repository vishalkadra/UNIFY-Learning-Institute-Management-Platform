import { useEffect, useState } from "react";
import API, { getApiError } from "./api";

const TYPE_LABELS = {
  placement: "Placement",
  trainer: "Trainer",
  management: "Management",
  hardware: "Hardware & lab",
  class: "Class / course",
};

function ManageComplaints() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [complaints, setComplaints] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(null);

  const loadData = async () => {
    try {
      const { data } = await API.get("/queries/", { headers });
      setComplaints(data);
    } catch (err) {
      setError(getApiError(err, "Could not load complaints."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateComplaint = async () => {
    try {
      const { data } = await API.patch(
        `/queries/${edit.id}/`,
        {
          type: edit.type,
          name: edit.name,
          email: edit.email,
          contact: edit.contact,
          problem: edit.problem,
        },
        { headers }
      );

      setComplaints((prev) =>
        prev.map((c) => (c.id === edit.id ? data : c))
      );
      setEdit(null);
      setError("");
    } catch (err) {
      setError(getApiError(err, "Complaint could not be updated."));
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;

    try {
      await API.delete(`/queries/${id}/`, { headers });
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(getApiError(err, "Complaint could not be deleted."));
    }
  };

  const markResolved = async (id) => {
    try {
      await API.patch(
        `/queries/${id}/`,
        { resolved: true },
        { headers }
      );

      setComplaints((prev) =>
        prev.map((c) =>
          Number(c.id) === Number(id) ? { ...c, resolved: true } : c
        )
      );
    } catch (err) {
      setError(getApiError(err, "Complaint could not be resolved."));
    }
  };

  const visible =
    filterType === "all"
      ? complaints
      : complaints.filter((c) => c.type === filterType);

  if (loading)
    return (
      <div className="text-center py-5 text-muted" role="status">
        Loading complaints...
      </div>
    );

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">🎫 Support Desk</span>
          <h1>Complaints & Queries</h1>
          <p>Manage and resolve user queries.</p>
        </div>
      </div>

      <div className="container page-body">
        <div className="d-flex justify-content-end mb-4">
          <select
            className="form-select w-auto shadow-sm"
            aria-label="Filter by category"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All categories</option>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">{error}</div>
        )}

        {visible.length === 0 && !error && (
          <div className="empty-state">
            No complaints in this category.
          </div>
        )}

        <div className="row g-4">
          {visible.map((c) => (
            <div className="col-md-6" key={c.id}>
              <div
                className={`card h-100 complaint-card ${c.resolved ? "is-resolved" : ""}`}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="pill pill-neutral">
                      {TYPE_LABELS[c.type] || c.type}
                    </span>

                    <span
                      className={`pill ${c.resolved ? "pill-resolved" : "pill-pending"}`}
                    >
                      {c.resolved ? "Resolved" : "Pending"}
                    </span>
                  </div>

                  <h6 className="fw-bold mb-2">{c.name}</h6>

                  <div className="small text-muted mb-3">
                    📞 {c.contact} &nbsp; • &nbsp; ✉ {c.email}
                  </div>

                  <div className="fact fact--block mb-3">
                    <small className="fact__label d-block mb-1">
                      Query
                    </small>
                    <span className="text-muted">{c.problem}</span>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    {!c.resolved && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => markResolved(c.id)}
                      >
                        ✓ Resolve
                      </button>
                    )}

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setEdit({ ...c })}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteComplaint(c.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {edit && (
        <div
          className="modal d-block"
          role="dialog"
          aria-modal="true"
          aria-label="Update complaint"
          style={{ background: "rgba(8, 15, 35, 0.65)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Complaint</h5>
                <button
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEdit(null)}
                />
              </div>

              <div className="modal-body">
                <select
                  className="form-select mb-3"
                  value={edit.type}
                  onChange={(e) =>
                    setEdit({ ...edit, type: e.target.value })
                  }
                >
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <input
                  className="form-control mb-3"
                  placeholder="Name"
                  value={edit.name}
                  onChange={(e) =>
                    setEdit({ ...edit, name: e.target.value })
                  }
                />

                <input
                  className="form-control mb-3"
                  placeholder="Email"
                  value={edit.email}
                  onChange={(e) =>
                    setEdit({ ...edit, email: e.target.value })
                  }
                />

                <input
                  className="form-control mb-3"
                  placeholder="Contact"
                  value={edit.contact}
                  onChange={(e) =>
                    setEdit({ ...edit, contact: e.target.value })
                  }
                />

                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Problem"
                  value={edit.problem}
                  onChange={(e) =>
                    setEdit({ ...edit, problem: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={updateComplaint}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageComplaints;