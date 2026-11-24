import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Moon, Sun } from "lucide-react";
import { getApiError } from "./api";
import NotificationBell from "./NotificationBell";
import Logo from "./Logo";
import "./App.css";
import "./theme.css";

const navClass = ({ isActive }) =>
  `nav-links__link${isActive ? " is-active" : ""}`;

function App() {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "null");

  const userName = userData
    ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim()
    : "";
  const userInitial = (userName || userData?.email || "U")
    .charAt(0)
    .toUpperCase();

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-bs-theme") || "light",
  );

  let dashboardLabel = "My dashboard";
  let dashboardPath = "/Home";

  if (userData?.is_superuser) {
    dashboardLabel = "Admin";
    dashboardPath = "/admin";
  } else if (userData?.is_staff) {
    dashboardLabel = "Staff dashboard";
    dashboardPath = "/DashBoard";
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-bs-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable – theme still applies for this visit */
    }
  };

  const handleLogout = () => {
    axios
      .post(
        "http://127.0.0.1:8000/logout-all/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        setLogoutError(
          getApiError(
            error,
            "Logout request failed. You have been logged out locally.",
          ),
        );
      })
      .finally(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("medata");
        closeMenu();
        navigate("/login");
      });
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {logoutError && (
        <div
          className="alert alert-warning rounded-0 mb-0 text-center"
          role="alert"
        >
          {logoutError}
        </div>
      )}

      <nav
        className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
        aria-label="Main navigation"
      >
        <div className="navbar__inner">
          <Link
            to="/"
            className="brand"
            onClick={closeMenu}
            aria-label="Unify home"
          >
            <Logo className="brand__logo" />
          </Link>

          <ul className="nav-links">
            <li className="nav-links__item">
              <NavLink to="/course" className={navClass}>
                Course
              </NavLink>
            </li>

            <li className="nav-links__item">
              <NavLink to="/placements" className={navClass}>
                Placements Drives
              </NavLink>
            </li>

            <li className="nav-links__item">
              <NavLink to="/experts" className={navClass}>
                Experts & Backbone
              </NavLink>
            </li>

            <li className="nav-links__item">
              <NavLink to="/faq" className={navClass}>
                FAQ'S & Contact
              </NavLink>
            </li>

            {/* Online Classes - Student, Staff & Admin */}
            {token && (
              <li className="nav-links__item">
                <NavLink
                  to="/online-classes"
                  className={navClass}
                  onClick={closeMenu}
                >
                  Online Classes
                </NavLink>
              </li>
            )}

            {/* Dashboard */}
            {token && (
              <li className="nav-links__item">
                <NavLink
                  to={dashboardPath}
                  className={navClass}
                  onClick={closeMenu}
                >
                  {dashboardLabel}
                </NavLink>
              </li>
            )}
          </ul>

          <div className="navbar__actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {token ? (
              <>
                <NotificationBell />

                <div className="user-area">
                  <div className="user-profile-hover" tabIndex={0}>
                    <span className="user-avatar" aria-hidden="true">
                      {userInitial}
                    </span>

                    <span className="user-name">
                      {userName || userData?.username || "User"}
                    </span>

                    <div className="user-profile-tooltip">
                      <strong>
                        {userName || userData?.username || "User"}
                      </strong>

                      <span>{userData?.email || "Email not available"}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="btn btn--ghost logout-btn"
                    type="button"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut size={15} aria-hidden="true" />
                    <span className="logout-btn__label">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn--primary">
                Log in
              </Link>
            )}
          </div>

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        >
          {token && userName && (
            <div className="mobile-menu__user">
              <span className="user-avatar" aria-hidden="true">
                {userInitial}
              </span>
              <span>{userName}</span>
            </div>
          )}

          <ul className="mobile-menu__links">
            <li>
              <NavLink to="/course" className={navClass} onClick={closeMenu}>
                Course Offers
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/placements"
                className={navClass}
                onClick={closeMenu}
              >
                Placements
              </NavLink>
            </li>

            <li>
              <NavLink to="/experts" className={navClass} onClick={closeMenu}>
                Experts & Backbone
              </NavLink>
            </li>

            <li>
              <NavLink to="/faq" className={navClass} onClick={closeMenu}>
                FAQ'S & Contact
              </NavLink>
            </li>

            {/* Same Online Classes for everyone */}
            {token && (
              <li>
                <NavLink
                  to="/online-classes"
                  className={navClass}
                  onClick={closeMenu}
                >
                  Online Classes
                </NavLink>
              </li>
            )}

            {token && (
              <li>
                <NavLink
                  to={dashboardPath}
                  className={navClass}
                  onClick={closeMenu}
                >
                  {dashboardLabel}
                </NavLink>
              </li>
            )}
          </ul>

          <div className="mobile-menu__actions">
            {token ? (
              <button
                onClick={handleLogout}
                className="btn btn--ghost"
                type="button"
              >
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn--primary"
                onClick={closeMenu}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main id="main-content" className="content-area">
        <Outlet />
      </main>
    </>
  );
}

export default App;
