import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Briefcase, LifeBuoy, Video } from "lucide-react";
import { Reveal, Tilt3D } from "./motion3d";

function StudentHome({ user }) {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">👋 Welcome back</span>
          <h1>
            Hi{user?.first_name ? `, ${user.first_name}` : ""}!
          </h1>
          <p>Here's a quick way to reach the things you use most.</p>
        </div>
      </div>

      <div className="container page-body">
        <Reveal className="row g-4">
          <div className="col-md-6 col-lg-3">
            <Link to="/placements" className="quick-link">
              <Tilt3D className="ui-card quick-card">
                <span className="icon-badge mb-3"><Briefcase size={22} aria-hidden="true" /></span>
                <ArrowUpRight size={18} className="quick-card__arrow" aria-hidden="true" />
                <h5>Placements</h5>
                <p className="text-muted mb-0">See open drives and company visits.</p>
              </Tilt3D>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/course" className="quick-link">
              <Tilt3D className="ui-card quick-card">
                <span className="icon-badge mb-3"><BookOpen size={22} aria-hidden="true" /></span>
                <ArrowUpRight size={18} className="quick-card__arrow" aria-hidden="true" />
                <h5>Course offers</h5>
                <p className="text-muted mb-0">Browse available courses and batches.</p>
              </Tilt3D>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/online-classes" className="quick-link">
              <Tilt3D className="ui-card quick-card">
                <span className="icon-badge mb-3"><Video size={22} aria-hidden="true" /></span>
                <ArrowUpRight size={18} className="quick-card__arrow" aria-hidden="true" />
                <h5>Online Classes</h5>
                <p className="text-muted mb-0">Join live classes for the courses you have purchased.</p>
              </Tilt3D>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/faq" className="quick-link">
              <Tilt3D className="ui-card quick-card">
                <span className="icon-badge mb-3"><LifeBuoy size={22} aria-hidden="true" /></span>
                <ArrowUpRight size={18} className="quick-card__arrow" aria-hidden="true" />
                <h5>Support</h5>
                <p className="text-muted mb-0">Raise a complaint or query.</p>
              </Tilt3D>
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}

export default StudentHome;
