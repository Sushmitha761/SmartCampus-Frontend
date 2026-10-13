import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://smartcampus-backend-96ly.onrender.com/api/admin/login",
        {
          email: email.trim().toLowerCase(),
          password: password,
        }
      );

      console.log("Admin login response:", response.data);

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
      console.error("Admin login error:", error);
      console.log("Backend response:", error.response?.data);

      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-image-section">
          <div className="admin-login-image-content">
            <h1>SmartCampus</h1>

            <p>College Complaint Management System</p>

            <span>
              Manage campus complaints efficiently.
            </span>
          </div>
        </div>

        <div className="admin-login-form-section">
          <div className="admin-login-icon">🔐</div>

          <h2>Admin Login</h2>

          <p className="admin-login-subtitle">
            Login to manage campus activities
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="admin-email">Email</label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="admin-password">Password</label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {message && (
              <p role="alert" className="admin-login-message">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="admin-register-section">
            <p>Don't have an admin account?</p>

            <button
              type="button"
              className="admin-register-button"
              onClick={() => navigate("/admin-register")}
            >
              Create Admin Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;