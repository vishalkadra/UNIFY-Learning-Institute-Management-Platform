import { useEffect, useState } from "react";
import { CalendarDays, Clock3, ExternalLink, PlayCircle } from "lucide-react";
import API, { getApiError } from "./api";

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OnlineClasses() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isStaff = user?.is_staff || user?.is_superuser;

  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/learning/classes/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => setClasses(data.results || data || []))
      .catch((e) =>
        setError(getApiError(e, "Online classes could not be loaded."))
      );
  }, [token]);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">🎓 Learning</span>
          <h1>Online Classes</h1>

          <p>
            {isStaff
              ? "View all available online classes."
              : "Access online classes for your purchased courses."}
          </p>
        </div>
      </div>

      <div className="container page-body">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {classes.length === 0 ? (
          <div className="empty-state">
            <span className="icon-badge icon-badge--lg mb-3" aria-hidden="true"><CalendarDays size={30} /></span>

            <h5>No online class available</h5>

            <p className="text-muted mb-0">
              {isStaff
                ? "No online classes have been added yet."
                : "Buy a course to get access to its classes."}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {classes.map((item) => (
              <div className="col-md-6 col-xl-4" key={item.id}>
                <div className="ui-card class-card">
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                    <span
                      className={`pill ${
                        item.state === "live"
                          ? "pill-resolved"
                          : "pill-neutral"
                      }`}
                    >
                      {item.state === "live"
                        ? "LIVE NOW"
                        : item.state === "upcoming"
                        ? "UPCOMING"
                        : "ENDED"}
                    </span>

                    <span className="small text-muted text-end">
                      {item.course_name}
                    </span>
                  </div>

                  <h5>{item.title}</h5>

                  <p className="text-muted">
                    {item.description ||
                      "Live online learning session."}
                  </p>

                  <div className="small mb-2 class-meta">
                    <CalendarDays size={15} className="me-2" aria-hidden="true" />
                    {formatDate(item.start_at)}
                  </div>

                  <div className="small mb-3 class-meta">
                    <Clock3 size={15} className="me-2" aria-hidden="true" />
                    {item.duration_minutes} minutes
                  </div>

                  {item.state === "live" && item.meeting_url && (
                    <a
                      href={item.meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary w-100"
                    >
                      <PlayCircle size={17} className="me-2" />
                      Join Live Class
                    </a>
                  )}

                  {item.state === "upcoming" && (
                    <div className="alert alert-light border mb-0 small">
                      Class starts on{" "}
                      <strong>{formatDate(item.start_at)}</strong>.
                    </div>
                  )}

                  {item.state === "ended" && item.recording_url && (
                    <a
                      href={item.recording_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary w-100"
                    >
                      <ExternalLink size={16} className="me-2" />
                      Watch Recording
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}