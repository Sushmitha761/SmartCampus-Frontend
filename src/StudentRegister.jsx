import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentRegister.css";

function StudentRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/students/register",
        {
          name,
          rollNo,
          email,
          password,
          department,
          year,
          phone
        }
      );

      alert("Student registration successful!");

      navigate("/student-login");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="student-register-page">

      <div className="student-register-card">

        {/* LEFT IMAGE SECTION */}

        <div className="register-image-section">

          <div className="register-image-content">

            <h1>SmartCampus</h1>

            <p>
              Join your smart campus community
            </p>

            <span>
              Register and manage your college complaints easily.
            </span>

          </div>

        </div>


        {/* RIGHT REGISTER SECTION */}

        <div className="register-form-section">

          <div className="register-icon">
            🎓
          </div>

          <h2>Create Student Account</h2>

          <p className="register-subtitle">
            Enter your details to register
          </p>


          <form onSubmit={handleRegister}>

            <div className="register-input-group">

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </div>


            <div className="register-input-group">

              <label>Roll Number</label>

              <input
                type="text"
                placeholder="Enter roll number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />

            </div>


            <div className="register-input-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            <div className="register-input-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>


            <div className="register-row">

              <div className="register-input-group">

                <label>Department</label>

                <input
                  type="text"
                  placeholder="Eg: ECE"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />

              </div>


              <div className="register-input-group">

                <label>Year</label>

                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >

                  <option value="">
                    Select
                  </option>

                  <option value="1">
                    1st Year
                  </option>

                  <option value="2">
                    2nd Year
                  </option>

                  <option value="3">
                    3rd Year
                  </option>

                  <option value="4">
                    4th Year
                  </option>

                </select>

              </div>

            </div>


            <div className="register-input-group">

              <label>Phone Number</label>

              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

            </div>


            <button
              type="submit"
              className="register-submit-button"
            >
              Create Account
            </button>

          </form>


          <div className="login-link-section">

            <p>
              Already have an account?
            </p>

            <button
              type="button"
              onClick={() => navigate("/student-login")}
              className="login-link-button"
            >
              ← Go to Student Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentRegister;