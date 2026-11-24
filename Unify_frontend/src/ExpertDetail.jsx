import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiError } from "./api";
import { Reveal, Tilt3D } from "./motion3d";
import {
  ArrowLeft,
  UserRound,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";

function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/experts/${id}/`)
      .then((response) => {
        setExpert(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(getApiError(error, "Expert details could not be loaded."));
        setLoading(false);
      });
  }, [id]);

  // Image URL handle karne ke liye
  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  };

  // Skills ko split karke array me convert karne ke liye
  const getSkillsArray = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading expert details...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="container py-5" style={{ maxWidth: "700px" }}>
        <div className="alert alert-danger p-4 text-center" role="alert">
          <h5 className="fw-bold mb-2">Unable to load details</h5>
          <p className="mb-4">{error || "Expert not found."}</p>
          <button
            className="btn btn-primary px-4"
            onClick={() => navigate("/experts")}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Experts
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(expert.image);
  const skillsList = getSkillsArray(expert.skills);

  return (
    <div className="container page-body" style={{ maxWidth: "1000px" }}>
      {/* Navigation Button */}
      <button
        className="btn btn-light border shadow-sm mb-4"
        onClick={() => navigate("/experts")}
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Experts
      </button>

      {/* Main Expert Card */}
      <div className="card overflow-hidden">
        {/* Header Banner */}
        <div className="expert-banner" />

        <div className="card-body p-4 p-md-5 expert-profile">
          {/* Profile Header */}
          <div className="text-center mb-5">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={expert.name}
                className="expert-avatar expert-avatar--xl"
              />
            ) : (
              <div className="expert-avatar expert-avatar--xl expert-avatar--empty mx-auto" role="img" aria-label={expert.name}>
                <UserRound size={70} aria-hidden="true" />
              </div>
            )}

            <h2 className="mt-3 mb-1">{expert.name}</h2>

            <div className="d-flex align-items-center justify-content-center gap-2 text-primary fw-medium">
              <Briefcase size={18} aria-hidden="true" />
              <span>{expert.role || "Professional Expert"}</span>
            </div>
          </div>

          <hr className="my-4" />

          {/* Details Grid */}
          <Reveal className="row g-4">
            {/* Qualification */}
            <div className="col-md-6">
              <Tilt3D className="detail-tile" maxTilt={5}>
                <div className="detail-tile__head">
                  <GraduationCap size={20} aria-hidden="true" />
                  <span>Qualification</span>
                </div>
                <p className="mb-0">
                  {expert.Qualification || expert.qualification || "N/A"}
                </p>
              </Tilt3D>
            </div>

            {/* Experience */}
            <div className="col-md-6">
              <Tilt3D className="detail-tile" maxTilt={5}>
                <div className="detail-tile__head">
                  <Clock size={20} aria-hidden="true" />
                  <span>Experience</span>
                </div>
                <p className="mb-0">
                  {expert.experience || "N/A"}
                </p>
              </Tilt3D>
            </div>

            {/* Expertise */}
            <div className="col-md-6">
              <Tilt3D className="detail-tile" maxTilt={5}>
                <div className="detail-tile__head">
                  <Award size={20} aria-hidden="true" />
                  <span>Primary Expertise</span>
                </div>
                <p className="mb-0">
                  {expert.expertise || "N/A"}
                </p>
              </Tilt3D>
            </div>

            {/* Skills */}
            <div className="col-md-6">
              <Tilt3D className="detail-tile" maxTilt={5}>
                <div className="detail-tile__head">
                  <Sparkles size={20} aria-hidden="true" />
                  <span>Skills</span>
                </div>

                {skillsList.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {skillsList.map((skill, index) => (
                      <span key={index} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mb-0">N/A</p>
                )}
              </Tilt3D>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default ExpertDetail;
