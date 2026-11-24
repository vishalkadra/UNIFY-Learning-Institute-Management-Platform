import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getApiError } from "./api";
import { Tilt3D, Reveal } from "./motion3d";
import {
  Users,
  ArrowRight,
  UserRound,
  Briefcase,
  AlertCircle,
  RefreshCw,
} from "lucide-react";


function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchExperts = () => {
    setLoading(true);
    setError("");
    API.get("/experts/")
      .then((response) => {
        setExperts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(getApiError(err, "Could not load experts. Please check your backend connection."));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `http://127.0.0.1:8000${image}`;
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">
            <Users size={14} /> Experts & Industry Backbone
          </span>
          <h1>Experts & Industry Backbone</h1>
          <p>
            Connect with seasoned mentors, technical advisors, and industry leaders
            who bring real-world mastery to empower your growth journey.
          </p>
        </div>
      </div>

      <div className="page-body" style={{ minHeight: "60vh" }}>
        <div className="container">

          {/* Error Alert State */}
          {error && (
            <div
              className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3 p-4 mb-5"
              role="alert"
            >
              <div className="d-flex align-items-center gap-3">
                <AlertCircle size={24} className="flex-shrink-0" aria-hidden="true" />
                <div>
                  <h6 className="fw-bold mb-1">Failed to load experts</h6>
                  <p className="mb-0 small">{error}</p>
                </div>
              </div>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={fetchExperts}
              >
                <RefreshCw size={14} aria-hidden="true" /> Retry
              </button>
            </div>
          )}

          {/* Skeleton Loading Grid */}
          {loading && (
            <div className="row g-4" aria-busy="true">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div className="col-md-6 col-lg-4" key={idx}>
                  <div className="card p-4 text-center h-100">
                    <div className="placeholder-glow mx-auto mb-4 expert-avatar-skeleton">
                      <div className="placeholder w-100 h-100 rounded-circle"></div>
                    </div>
                    <div className="placeholder-glow mb-2">
                      <span className="placeholder col-8 rounded"></span>
                    </div>
                    <div className="placeholder-glow mb-4">
                      <span className="placeholder col-5 rounded"></span>
                    </div>
                    <div className="placeholder-glow mt-auto">
                      <span className="placeholder col-12 py-3 rounded-3"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && experts.length === 0 && (
            <div className="empty-state">
              <span className="icon-badge icon-badge--lg icon-badge--round mb-3" aria-hidden="true">
                <UserRound size={34} />
              </span>
              <h5 className="fw-bold mb-1">No Experts Found</h5>
              <p className="text-muted small mb-0">
                Expert profiles will appear here soon.
              </p>
            </div>
          )}

          {/* Experts Grid */}
          {!loading && !error && experts.length > 0 && (
            <Reveal className="row g-4">
              {experts.map((expert) => {
                const imageUrl = getImageUrl(expert.image);

                return (
                  <div className="col-md-6 col-lg-4" key={expert.id}>
                    <Tilt3D className="card expert-card h-100 text-center" maxTilt={7}>
                      <div className="card-body p-4 d-flex flex-column">

                        {/* Expert Image Avatar */}
                        <div className="mb-3 mx-auto mt-2">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={expert.name}
                              className="expert-avatar"
                              loading="lazy"
                            />
                          ) : (
                            <div className="expert-avatar expert-avatar--empty" role="img" aria-label={expert.name}>
                              <UserRound size={52} aria-hidden="true" />
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h4 className="mb-1 fs-5">{expert.name}</h4>

                        {/* Role */}
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                          <Briefcase size={15} className="text-primary" aria-hidden="true" />
                          <span className="text-muted fw-medium small">{expert.role || "Domain Expert"}</span>
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto">
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate(`/expert/${expert.id}`)}
                          >
                            View Profile
                            <ArrowRight size={16} aria-hidden="true" />
                          </button>
                        </div>

                      </div>
                    </Tilt3D>
                  </div>
                );
              })}
            </Reveal>
          )}

        </div>
      </div>
    </>
  );
}

export default Experts;
