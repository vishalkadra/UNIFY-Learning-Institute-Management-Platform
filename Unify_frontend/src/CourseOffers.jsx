import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import API, { getApiError } from "./api";
import { Tilt3D, Reveal } from "./motion3d";


function CourseOffers() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/courses/")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(getApiError(err, "Could not load courses. Please try again later."));
        setLoading(false);
      });
  }, []);

  const handleSelectCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <span className="page-hero__eyebrow">📚 Explore Programs</span>
            <h1>Featured Course Offers</h1>
            <p>Enhance your skills with our industry-leading courses designed by experts.</p>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center py-5 my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading courses...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <span className="page-hero__eyebrow">📚 Explore Programs</span>
            <h1>Featured Course Offers</h1>
          </div>
        </div>
        <div className="container page-body">
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">📚 Explore Programs</span>
          <h1>Featured Course Offers</h1>
          <p>Enhance your skills with our industry-leading courses designed by experts.</p>
        </div>
      </div>

      <div className="container page-body">
        {courses.length === 0 ? (
          <div className="empty-state">
            <p className="mb-0">No courses published yet. Check back soon!</p>
          </div>
        ) : (
          <Reveal className="row g-4">
            {courses.map((course) => (
              <div className="col-12 col-md-6 col-lg-4" key={course.id}>
                <Tilt3D className="card course-card h-100 overflow-hidden">
                  {/* Course Image */}
                  <div className="course-card__media">
                    {course.image ? (
                      <img src={course.image} alt={course.name} className="course-card__img" loading="lazy" />
                    ) : (
                      <div className="course-card__placeholder" aria-hidden="true">
                        <BookOpen size={44} />
                      </div>
                    )}
                    <span className="badge bg-success course-card__badge">Active</span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column p-4">
                    <h4 className="course-card__title text-break">{course.name}</h4>

                    <p className="text-muted flex-grow-1 course-card__desc">{course.description}</p>

                    {/* Duration and Certificate */}
                    <div className="course-card__meta">
                      <div>
                        <small className="meta-label">Duration</small>
                        <span className="meta-value">{course.duration || "Self-Paced"}</span>
                      </div>
                      <div className="text-end">
                        <small className="meta-label">Certificate</small>
                        <span className="meta-value">Available</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="course-card__price">
                      <span className="meta-label">Total Fee</span>
                      <p className="price text-break">
                        ₹{Number(course.price || 0).toLocaleString("en-IN")}
                      </p>

                      <button
                        className="btn btn-primary w-100"
                        onClick={() => handleSelectCourse(course.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </Tilt3D>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </>
  );
}

export default CourseOffers;
