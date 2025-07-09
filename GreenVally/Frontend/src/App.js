// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Appointments from "./Appointments";
import Doctors from "./Doctors";
import Patients from "./components/Patients";
import Specialty from "./components/Specialty";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Forget from "./components/Forget-pass";
import { useAuth, AuthProvider } from "./components/Authcontect";
import PrivateRoute from "./components/PrivateRoute";
import About from "./components/About";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isLinkActive = (path) => window.location.pathname === path;

  return (
    <nav className="hospital-navbar">
      <div className="hospital-navbar-brand">Green Valley Hospital</div>
      <input
        type="checkbox"
        id="menu-toggle"
        className="hospital-menu-toggle"
      />
      <label htmlFor="menu-toggle" className="hospital-menu-icon">
        ☰
      </label>

      <ul className="hospital-navbar-links">
        <li className={isLinkActive("/") ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>

        <li
          className={`hospital-nav-item ${
            isLinkActive("/doctors") ? "active" : ""
          }`}
        >
          <Link to="/doctors">Doctors</Link>
          <ul className="hospital-dropdown">
            <li className="hospital-has-submenu">
              Specialties
              <ul className="hospital-submenu">
                <li>
                  <Link to="/doctors/Cardiology">Cardiology</Link>
                </li>
                <li>
                  <Link to="/doctors/Neurology">Neurology</Link>
                </li>
                <li>
                  <Link to="/doctors/Orthopedics">Orthopedics</Link>
                </li>
                <li>
                  <Link to="/doctors/Dermatology">Dermatology</Link>
                </li>
                <li>
                  <Link to="/doctors/Pediatrics">Pediatrics</Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        {user && user.role === "admin" && (
          <>
            <li className={isLinkActive("/patients") ? "active" : ""}>
              <Link to="/patients">Patients</Link>
            </li>
          </>
        )}
        <li className={isLinkActive("/appointments") ? "active" : ""}>
          <Link to="/appointments">Appointments</Link>
        </li>
        <li className={isLinkActive("/about") ? "active" : ""}>
          <Link to="/About">About Us</Link>
        </li>

        {user ? (
          <li>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              style={{
                background: "none",
                marginTop: "8px",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Logout ({user.username})
            </button>
          </li>
        ) : (
          <li className={isLinkActive("/login") ? "active" : ""}>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const AppContent = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />

      {/* 🔒 Protected: Only logged-in users can access */}
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctors/:specialtyName?"
        element={
          <PrivateRoute>
            <Doctors />
          </PrivateRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <Patients />
          </PrivateRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/specialty/:name" element={<Specialty />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<Forget />} />
      <Route path="/About" element={<About />} />
    </Routes>
    <Footer />
  </>
);
export { AppContent };
const App = () => (
  <AuthProvider>
    <Router>
      <div className="hospital-container">
        <AppContent />
      </div>
    </Router>
  </AuthProvider>
);

export default App;
