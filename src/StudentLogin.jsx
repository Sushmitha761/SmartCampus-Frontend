import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentLogin.css";

function StudentLogin() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/students/login",
        {
          rollNo: rollNo.trim(),
          password: password
        }
      );

      console.log("Login response:", response.data);

      localStorage.setItem("rollNo", rollNo.trim());

      alert("Student login successful!");

      navigate("/dashboard");

    } catch (error) {
      console.log("Login error:", error);
      console.log("Backend response:", error.response?.data);

      alert(
        error.response?.data ||
        "Invalid roll number or password"
      );
    }
  };

  return (
    <div className="student-login-page">

      <div className="student-login-card">

        {/* LEFT IMAGE */}

        <div className="login-image-section">

          <div className="image-content">

            <h1>SmartCampus</h1>

            <p>
              College Complaint Management System
            </p>

            <span>
              Smart solutions for a better campus
            </span>

          </div>

        </div>

        {/* RIGHT LOGIN */}

        <div className="login-form-section">

          <div className="login-icon">
            🎓
          </div>

          <h2>Student Login</h2>

          <p className="login-subtitle">
            Login to manage your campus complaints
          </p>

          <form onSubmit={handleLogin}>

            <label>Roll Number</label>

            <input
              type="text"
              placeholder="Enter your roll number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

          <div className="register-section">

            <p>Don't have an account?</p>

            <button
              type="button"
              className="register-button"
              onClick={() => navigate("/student-register")}
            >
              Create Student Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentLogin;