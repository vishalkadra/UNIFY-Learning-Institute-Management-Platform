import { useEffect, useState } from "react";
import API, { getApiError } from "./api";

export default function ManageEnrollments() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const load = () => {
    API.get("/learning/enrollments/", { headers })
      .then(({ data }) => setItems(data.results || data || []))
      .catch((e) =>
        setError(getApiError(e, "Could not load enrollments."))
      );
  };

  useEffect(() => {
    load();
  }, []);

  const updateAccess = async (id, action) => {
    try {
      setError("");
      setLoadingId(id);

      await API.post(
        `/learning/enrollments/${id}/${action}/`,
        {},
        { headers }
      );

      await load();
    } catch (e) {
      setError(
        getApiError(
          e,
          action === "mark_paid"
            ? "Could not activate access."
            : "Could not deactivate access."
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">Staff / Admin</span>
          <h1>Course Enrollments</h1>
        </div>
      </div>

      <div className="container page-body">
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="table-responsive ui-card p-0">
        <table className="table mb-0 align-middle">
          <thead>
            <tr>
              <th>Name & Email</th>
              <th>Course</th>
              <th>Status</th>
              <th>Purchased</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((x) => (
                <tr key={x.id}>
                  <td>
                    <div className="fw-semibold">
                      {x.user_name || "Student"}
                    </div>

                    <small className="text-muted">
                      {x.user_email || "Email not available"}
                    </small>
                  </td>

                  <td>{x.course_name || "—"}</td>

                  <td>
                    <span
                      className={`pill ${
                        x.status === "paid"
                          ? "pill-resolved"
                          : "pill-pending"
                      }`}
                    >
                      {x.status}
                    </span>
                  </td>

                  <td>
                    {x.purchased_at
                      ? new Date(x.purchased_at).toLocaleString("en-IN")
                      : "—"}
                  </td>

                  <td>
                    {x.status !== "paid" ? (
                      <button
                        className="btn btn-sm btn-success"
                        disabled={loadingId === x.id}
                        onClick={() =>
                          updateAccess(x.id, "mark_paid")
                        }
                      >
                        {loadingId === x.id
                          ? "Please wait..."
                          : "Activate Access"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={loadingId === x.id}
                        onClick={() =>
                          updateAccess(x.id, "deactivate")
                        }
                      >
                        {loadingId === x.id
                          ? "Please wait..."
                          : "Deactivate Access"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
