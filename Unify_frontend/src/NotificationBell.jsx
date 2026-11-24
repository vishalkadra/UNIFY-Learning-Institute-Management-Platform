import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import API from "./api";

export default function NotificationBell() {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    API.get("/learning/notifications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => setItems(data.results || data || [])).catch(() => {});
  }, [token]);

  // Close the panel on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!token) return null;

  const unread = items.filter((x) => !x.is_read).length;

  const markRead = async (id) => {
    try {
      await API.patch(`/learning/notifications/${id}/`, { is_read: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((old) => old.map((x) => x.id === id ? { ...x, is_read: true } : x));
    } catch {}
  };

  const markAll = async () => {
    try {
      await API.post("/learning/notifications/read_all/", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((old) => old.map((x) => ({ ...x, is_read: true })));
    } catch {}
  };

  return (
    <div className="notification-wrap" ref={wrapRef}>
      <button
        className="notification-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {unread > 0 && <span className="notification-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button onClick={markAll} className="notification-readall">
                <CheckCheck size={15} /> Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="notification-empty">No notifications yet.</div>
          ) : items.slice(0, 20).map((item) => (
            <button
              key={item.id}
              className={`notification-item ${item.is_read ? "read" : "unread"}`}
              onClick={() => !item.is_read && markRead(item.id)}
            >
              <span className="notification-dot" />
              <span>
                <strong>{item.title}</strong>
                <small>{item.message}</small>
                <em>{new Date(item.created_at).toLocaleString("en-IN")}</em>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
