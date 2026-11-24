import { useState, useEffect } from "react";
import API, { getApiError } from "./api";
import { ShieldCheck, UserCog, Trash2 } from "lucide-react";

function ManageUsers() {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  const loadUsers = () => {
    setLoading(true);
    setError("");

    API.get("/users/", { headers: authHeaders })
      .then((res) => setUsers(res.data))
      .catch((err) => setError(getApiError(err, "Could not load users.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleFlag = (userId, field, currentValue) => {
    setError("");

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, [field]: !currentValue } : u
      )
    );

    API.patch(
      `/users/${userId}/`,
      { [field]: !currentValue },
      { headers: authHeaders }
    ).catch((err) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, [field]: currentValue } : u
        )
      );
      setError(getApiError(err, "Could not update user."));
    });
  };

  const deleteUser = (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    setError("");

    API.delete(`/users/${userId}/`, { headers: authHeaders })
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      })
      .catch((err) => {
        setError(getApiError(err, "Could not delete user."));
      });
  };

  if (loading) return <p className="text-center py-5" role="status">Loading users...</p>;

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">👥 Admin</span>
          <h1>Manage users</h1>
          <p>Manage staff access, superuser permissions, and users.</p>
        </div>
      </div>

      <div className="container page-body">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th className="text-center">No.</th>
                <th>Name</th>
                <th>Email</th>
                <th className="text-center">Staff</th>
                <th className="text-center">Superuser</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>

                  <td className="text-center">
                    <button
                      className={`btn btn-sm ${u.is_staff ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => toggleFlag(u.id, "is_staff", u.is_staff)}
                      disabled={u.id === currentUser?.id}
                    >
                      <UserCog size={14} className="me-1" />
                      {u.is_staff ? "Staff" : "Make staff"}
                    </button>
                  </td>

                  <td className="text-center">
                    <button
                      className={`btn btn-sm ${u.is_superuser ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => toggleFlag(u.id, "is_superuser", u.is_superuser)}
                      disabled={u.id === currentUser?.id}
                    >
                      <ShieldCheck size={14} className="me-1" />
                      {u.is_superuser ? "Superuser" : "Make superuser"}
                    </button>
                  </td>

                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        deleteUser(u.id, `${u.first_name} ${u.last_name}`.trim() || u.email)
                      }
                      disabled={u.id === currentUser?.id}
                      title={u.id === currentUser?.id ? "You cannot delete yourself" : "Delete user"}
                    >
                      <Trash2 size={14} className="me-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !error && (
          <div className="empty-state mt-4">No users found.</div>
        )}
      </div>
    </>
  );
}

export default ManageUsers;
