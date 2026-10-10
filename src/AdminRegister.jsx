import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminRegister.css";

function AdminRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/register",
        { name: name.trim(), email: email.trim(), password }
      );

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Admin registration successful!"
      );

      setTimeout(() => navigate("/admin-login"), 1200);
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-register-page">
      <section className="admin-register-card">
        <header className="admin-register-brand">
          <div className="admin-register-icon">🛡️</div>
          <h1>SmartCampus</h1>
          <p>Campus Administration Portal</p>
        </header>

        <div className="admin-register-content">
          <h2>Create Admin Account</h2>
          <p className="admin-register-description">
            Register to manage campus complaints and departments.
          </p>

          <form onSubmit={handleRegister}>
            <label htmlFor="admin-name">Admin Name</label>
            <input
              id="admin-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="admin-email">Email Address</label>
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
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            <button
              type="submit"
              className="admin-register-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register Admin"}
            </button>
          </form>

          {message && (
            <p className="admin-register-message" role="status">
              {message}
            </p>
          )}

          <p className="admin-register-footer">
            Already registered?{" "}
            <Link to="/admin-login">Login here</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default AdminRegister;