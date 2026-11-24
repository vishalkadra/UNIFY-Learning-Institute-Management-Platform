import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Clock, Award, MonitorPlay, Lock } from "lucide-react";
import API, { getApiError } from "./api";
import { Reveal, Tilt3D } from "./motion3d";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/courses/")
      .then(({ data }) => {
        const c = (data.results || data).find((x) => String(x.id) === String(id));
        c ? setCourse(c) : setError("Course not found.");
      })
      .catch((error) => setError(getApiError(error, "Course details could not be loaded.")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  if (!course) return null;

  const price = Number(course.price || 0);
  const modules = course.modules || [];

  return (
    <div className="course-detail">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card overflow-hidden">
              {course.image ? (
                <img
                  src={course.image.startsWith("http") ? course.image : `http://127.0.0.1:8000${course.image}`}
                  alt={course.name}
                  className="course-detail__cover"
                />
              ) : (
                <div className="course-detail__cover course-detail__cover--empty" role="img" aria-label={course.name}>
                  <MonitorPlay size={64} aria-hidden="true" />
                </div>
              )}

              <div className="card-body p-4 p-lg-5">
                <span className="badge bg-success mb-3">Active Course</span>
                <h1 className="text-break mb-3">{course.name}</h1>

                <p className="text-muted fs-5" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                  {course.description || "No course description available."}
                </p>

                <Reveal className="row g-3 mt-2">
                  <Info icon={Clock} title="Duration" value={course.duration || "Self-Paced"} />
                  <Info icon={Award} title="Certificate" value="Available" />
                  <Info icon={MonitorPlay} title="Course Type" value="Online" />
                </Reveal>

                <h3 className="mt-5 mb-4">What You Will Learn</h3>

                <Reveal className="row g-3">
                  {[
                    "Industry-ready skills",
                    "Practical projects",
                    "Expert guidance",
                    "Certificate after completion",
                    "Real-world projects",
                    "Placement assistance",
                  ].map((x, i) => (
                    <div className="col-md-6" key={i}>
                      <Tilt3D className="learn-item">
                        <span className="learn-item__check" aria-hidden="true">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        {x}
                      </Tilt3D>
                    </div>
                  ))}
                </Reveal>

                <h3 className="mt-5 mb-4">Course Curriculum</h3>

                {modules.length ? (
                  <div className="accordion" id="curriculum">
                    {modules.map((m, i) => (
                      <div className="accordion-item" key={m.id}>
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target={`#module${m.id}`}
                            type="button"
                          >
                            <strong>Module {i + 1}</strong>
                            <span className="ms-2 text-break">- {m.title}</span>
                          </button>
                        </h2>

                        <div id={`module${m.id}`} className="accordion-collapse collapse" data-bs-parent="#curriculum">
                          <div className="accordion-body">
                            {m.description && <p className="text-muted mb-0">{m.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light border">No curriculum available for this course yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card enroll-card">
              <div className="card-body p-4">
                <h4 className="mb-4">Enroll in Course</h4>
                <small className="text-muted">Selected Course</small>
                <h6 className="fw-bold mt-1 text-break">{course.name}</h6>

                <div className="d-flex justify-content-between my-3">
                  <span className="text-muted">Course Fee</span>
                  <strong>₹{price.toLocaleString("en-IN")}</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Certificate</span>
                  <span className="text-success fw-semibold">Included</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <strong>Total Amount</strong>
                  <span className="enroll-card__total">₹{price.toLocaleString("en-IN")}</span>
                </div>

                <h6 className="fw-bold mb-3">Payment Options</h6>

                <Payment id="upi" title="UPI" text="Google Pay, PhonePe, Paytm etc." checked />
                <Payment id="card" title="Credit / Debit Card" />
                <Payment id="netbanking" title="Net Banking" />

                <button
                  className="btn btn-primary btn-lg w-100 mt-3"
                  onClick={() => navigate(`/courses/${course.id}/payment`)}
                >
                  Proceed to Payment →
                </button>

                <div className="text-center mt-3 text-muted small">
                  <Lock size={14} className="me-1" aria-hidden="true" />
                  Secure & Safe Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function Info({ icon: Icon, title, value }) {
  return (
    <div className="col-md-4">
      <div className="info-tile">
        <span className="icon-badge" aria-hidden="true"><Icon size={20} /></span>
        <div>
          <small className="text-muted">{title}</small>
          <h6 className="fw-bold mb-0">{value}</h6>
        </div>
      </div>
    </div>
  );
}

function Payment({ id, title, text, checked }) {
  return (
    <label className="pay-option" htmlFor={id}>
      <div className="form-check mb-0">
        <input className="form-check-input" type="radio" name="payment" id={id} defaultChecked={checked} />
        <span className="form-check-label fw-semibold">{title}</span>
      </div>
      {text && <small className="text-muted d-block ms-4">{text}</small>}
    </label>
  );
}

export default CourseDetails;
