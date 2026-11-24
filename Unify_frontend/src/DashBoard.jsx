import { useState, useEffect } from "react";
import API, { getApiError } from "./api";
import { BookOpen, Users, Briefcase, MessageSquareWarning, Video, Bell, GraduationCap } from "lucide-react";
import MetricCard from "./MetricCard";
import ActionCard from "./ActionCard";


function DashBoard() {
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    total_courses: 0,
    total_experts: 0,
    total_placements: 0,
    pending_complaints: 0,
  });
  const [learning, setLearning] = useState({total_enrollments:0,paid_enrollments:0,upcoming_classes:0,live_classes:0,notifications:0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      API.get("/dashboard/stats/", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/learning/stats/", { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([statsResponse, learningResponse]) => {
        setStats(statsResponse.data);
        setLearning(learningResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(getApiError(err, "Dashboard data could not be loaded."));
        setLoading(false);
      });
  }, [token]);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">🛠️ Staff Panel</span>
          <h1>Staff dashboard</h1>
          <p>Welcome, {userData?.first_name || userData?.email}.</p>
        </div>
      </div>

      <div className="container page-body">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="row g-3 mb-5">
          <MetricCard icon={BookOpen} label="Courses" value={stats.total_courses} loading={loading} />
          <MetricCard icon={Users} label="Experts" value={stats.total_experts} loading={loading} />
          <MetricCard icon={Briefcase} label="Placement drives" value={stats.total_placements} loading={loading} />
          <MetricCard icon={MessageSquareWarning} label="Pending complaints" value={stats.pending_complaints} loading={loading} />
        </div>

        <h6 className="section-label">Learning</h6>
        <div className="row g-3 mb-5">
          <MetricCard icon={GraduationCap} label="Paid enrollments" value={learning.paid_enrollments} loading={loading} />
          <MetricCard icon={Video} label="Upcoming classes" value={learning.upcoming_classes} loading={loading} />
          <MetricCard icon={Bell} label="Notifications" value={learning.notifications} loading={loading} />
        </div>

        <h5 className="section-label mt-2">Manage</h5>
        <div className="row g-4">
          <ActionCard
            icon={BookOpen}
            title="Manage courses"
            description="Add, edit or remove courses shown on the Course Offers page."
            to="/manage-courses"
          />
          <ActionCard
            icon={Users}
            title="Manage experts"
            description="Add or update the experts listed on the Experts & Backbone page."
            to="/manage-experts"
          />
          <ActionCard
            icon={Briefcase}
            title="Add placement"
            description="Publish a new placement drive for students to see."
            to="/add-placement"

          />
          <ActionCard
            icon={Video}
            title="Manage online classes"
            description="Create class schedules, meeting links and recordings for each course."
            to="/manage-online-classes"
          />
          <ActionCard
            icon={Bell}
            title="Manage notifications"
            description="Send course, class and important announcements to students."
            to="/manage-notifications"
          />
          <ActionCard
            icon={GraduationCap}
            title="Manage enrollments"
            description="See course purchases and activate access after payment confirmation."
            to="/manage-enrollments"
          />
          <ActionCard
            icon={MessageSquareWarning}
            title="View complaints"
            description="Review and resolve queries raised from the FAQ page."
            to="/manage-complaints"
          />
        </div>
      </div>
    </>
  );
}

export default DashBoard;
