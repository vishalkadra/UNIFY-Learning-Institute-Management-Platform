import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Landing from "./Landing";
import Login from "./Login";
import Signup from "./Signup";
import VerifyOTP from "./VerifyOTP";
import ForgetPassword from "./ForgetPassword";
import Placements from "./Placements";
import CourseOffers from "./CourseOffers";
import Experts from "./Experts";
import Faq from "./Faq";
import Home from "./Home";
import DashBoard from "./DashBoard";
import AdminDashboard from "./AdminDashboard";
import ManageUsers from "./ManageUsers";
import ManageComplaints from "./ManageComplaints";
import ManageCourses from "./ManageCourses";
import ManageExperts from "./ManageExperts";
import AddPlacement from "./AddPlacement";
import RequireRole from "./RequireRole";
import ExpertDetail from "./ExpertDetail";
import CourseDetails from "./CourseDetails";
import OnlineClasses from "./OnlineClasses";
import ManageOnlineClasses from "./ManageOnlineClasses";
import ManageNotifications from "./ManageNotifications";
import ManageEnrollments from "./ManageEnrollments";
import PaymentPage from "./PaymentPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<App />}>

        <Route index element={<Landing />} />

        <Route path="course" element={<CourseOffers />} />

        <Route path="placements" element={<Placements />} />

        <Route path="experts" element={<Experts />} />

        <Route path="expert/:id" element={<ExpertDetail />} />

        <Route path="faq" element={<Faq />} />

        <Route path="Home" element={<Home />} />

        <Route
          path="DashBoard"
          element={
            <RequireRole role="staff">
              <DashBoard />
            </RequireRole>
          }
        />

        <Route
          path="admin"
          element={
            <RequireRole role="superuser">
              <AdminDashboard />
            </RequireRole>
          }
        />

        <Route
          path="manage-courses"
          element={
            <RequireRole role="staff">
              <ManageCourses />
            </RequireRole>
          }
        />

        <Route
          path="manage-experts"
          element={
            <RequireRole role="staff">
              <ManageExperts />
            </RequireRole>
          }
        />

        <Route
          path="add-placement"
          element={
            <RequireRole role="staff">
              <AddPlacement />
            </RequireRole>
          }
        />

        <Route
          path="manage-complaints"
          element={
            <RequireRole role="staff">
              <ManageComplaints />
            </RequireRole>
          }
        />

        {/* Online Classes - Student, Staff and Admin */}
        <Route
          path="online-classes"
          element={<OnlineClasses />}
        />

        {/* Manage Online Classes - Staff/Admin */}
        <Route
          path="manage-online-classes"
          element={
            <RequireRole role="staff">
              <ManageOnlineClasses />
            </RequireRole>
          }
        />

        {/* Manage Notifications - Staff/Admin */}
        <Route
          path="manage-notifications"
          element={
            <RequireRole role="staff">
              <ManageNotifications />
            </RequireRole>
          }
        />

        {/* Manage Enrollments - Staff/Admin */}
        <Route
          path="manage-enrollments"
          element={
            <RequireRole role="staff">
              <ManageEnrollments />
            </RequireRole>
          }
        />

        <Route
          path="manage-users"
          element={
            <RequireRole role="superuser">
              <ManageUsers />
            </RequireRole>
          }
        />

      </Route>

      <Route path="/courses/:id" element={<CourseDetails />} />

      <Route
        path="/courses/:id/payment"
        element={<PaymentPage />}
      />

      {/* Auth Routes */}

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route
        path="/forgot-password"
        element={<ForgetPassword />}
      />

    </Routes>
  </BrowserRouter>
);