import { useState, useEffect } from "react";
import API, { getApiError } from "./api";
import {
  Users,
  ShieldCheck,
  BookOpen,
  Briefcase,
  UserCog,
  MessageSquareWarning,
  Video,
  Bell,
  GraduationCap,
} from "lucide-react";
import MetricCard from "./MetricCard";
import ActionCard from "./ActionCard";


function AdminDashboard() {
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    total_users: 0,
    total_staff: 0,
    total_superusers: 0,
    total_courses: 0,
    total_experts: 0,
    total_placements: 0,
    pending_complaints: 0,
  });
  const [learning, setLearning] = useState({paid_enrollments:0,upcoming_classes:0,notifications:0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      API.get("/dashboard/stats/", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/learning/stats/", { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([response, learningResponse]) => {
        setStats(response.data);
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
          <span className="page-hero__eyebrow">🛡️ Admin Panel</span>
          <h1>Admin dashboard</h1>
          <p>Superuser access, {userData?.first_name || userData?.email}.</p>
        </div>
      </div>

      <div className="container page-body">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <h6 className="section-label">People</h6>
        <div className="row g-3 mb-4">
          <MetricCard icon={Users} label="Total users" value={stats.total_users} loading={loading} />
          <MetricCard icon={UserCog} label="Staff members" value={stats.total_staff} loading={loading} />
          <MetricCard icon={ShieldCheck} label="Superusers" value={stats.total_superusers} loading={loading} />
          <MetricCard icon={MessageSquareWarning} label="Pending complaints" value={stats.pending_complaints} loading={loading} />
        </div>

        <h6 className="section-label">Content</h6>
        <div className="row g-3 mb-5">
          <MetricCard icon={BookOpen} label="Courses" value={stats.total_courses} loading={loading} />
          <MetricCard icon={Users} label="Experts" value={stats.total_experts} loading={loading} />
          <MetricCard icon={Briefcase} label="Placement drives" value={stats.total_placements} loading={loading} />
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
            icon={UserCog}
            title="Manage users"
            description="Promote users to staff, grant superuser access, or remove access."
            to="/manage-users"
          />
          <ActionCard
            icon={Video}
            title="Manage online classes"
            description="Create schedules and meeting links course-wise."
            to="/manage-online-classes"
          />
          <ActionCard
            icon={Bell}
            title="Manage notifications"
            description="Send announcements to all students or a selected student."
            to="/manage-notifications"
          />
          <ActionCard
            icon={GraduationCap}
            title="Manage enrollments"
            description="Review purchases and activate course access after payment confirmation."
            to="/manage-enrollments"
          />
          <ActionCard
            icon={MessageSquareWarning}
            title="View complaints"
            description="Review and resolve every query raised across all categories."
            to="/manage-complaints"
          />
          <ActionCard
            icon={BookOpen}
            title="Manage courses"
            description="Add, edit or remove courses."
            to="/manage-courses"
          />
          <ActionCard
            icon={Users}
            title="Manage experts"
            description="Add or update listed experts."
            to="/manage-experts"
          />
          <ActionCard
            icon={Briefcase}
            title="Add placement"
            description="Publish a new placement drive."
            to="/add-placement"
          />
          <ActionCard
            icon={ShieldCheck}
            title="Staff dashboard"
            description="Open the regular staff view."
            to="/DashBoard"
          />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
