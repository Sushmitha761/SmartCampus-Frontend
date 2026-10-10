
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/login",
        {
          email: email.trim().toLowerCase(),
          password: password,
        }
      );

      if (response.data === "Admin login successful!") {
        navigate("/admin-dashboard");
      } else {
        setMessage(
          typeof response.data === "string"
            ? response.data
            : "Login failed. Please try again."
        );
      }
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-layout">

        {/* LEFT WELCOME SECTION */}
        <div className="admin-welcome-panel">
          <div className="campus-brand">
            <span className="campus-brand-icon">🎓</span>
            <span>SmartCampus</span>
          </div>

          <p className="portal-label">ADMIN PORTAL</p>

          <h1>Welcome Back, Admin!</h1>

          <p className="welcome-description">
            Manage campus complaints, departments, and student
            support services efficiently from one place.
          </p>

          <div className="admin-features">
            <div className="admin-feature">
              <span className="feature-icon">📋</span>
              <div>
                <h3>Manage Complaints</h3>
                <p>Track and resolve student complaints.</p>
              </div>
            </div>

            <div className="admin-feature">
              <span className="feature-icon">🏢</span>
              <div>
                <h3>Manage Departments</h3>
                <p>Organize departments and assigned staff.</p>
              </div>
            </div>

            <div className="admin-feature">
              <span className="feature-icon">📊</span>
              <div>
                <h3>View Statistics</h3>
                <p>Monitor complaint status and progress.</p>
              </div>
            </div>

            <div className="admin-feature">
              <span className="feature-icon">🛡️</span>
              <div>
                <h3>Secure Admin Access</h3>
                <p>Access the administration dashboard.</p>
              </div>
            </div>
          </div>

          <p className="welcome-footer">
            A better campus starts with better support.
          </p>
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="admin-login-panel">
          <div className="login-card">

            <div className="login-icon">🔐</div>

            <p className="login-eyebrow">WELCOME BACK</p>
            <h2>Admin Login</h2>

            <p className="login-description">
              Sign in to your SmartCampus account
            </p>

            <form onSubmit={handleLogin}>
              <label htmlFor="admin-login-email">
                Admin Email
              </label>

              <div className="admin-input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="admin-login-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="admin-login-password">
                Password
              </label>

              <div className="admin-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="admin-login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  className="show-password-button"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {message && (
                <div className="admin-login-message" role="alert">
                  {message}
                </div>
              )}

              <button
                className="admin-signin-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <div className="secure-note">
              <span>🛡️</span>
              <div>
                <strong>Secure Admin Access</strong>
                <p>Authorized administration portal</p>
              </div>
            </div>

            <p className="admin-register-link">
              New administrator?{" "}
              <Link to="/admin-register">Register here</Link>
            </p>
          </div>
        </div>

      </section>

      <footer className="admin-copyright">
        © 2026 SmartCampus. All rights reserved.
      </footer>
    </main>
  );
}

export default AdminLogin;
