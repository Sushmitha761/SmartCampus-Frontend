import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const rollNo = localStorage.getItem("rollNo");
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!rollNo) {
      setMessage("Please login to view your profile.");
      return;
    }

    axios
      .get(
        `https://smartcampus-backend-96ly.onrender.com/api/students/profile/${encodeURIComponent(rollNo)}`
      )
      .then((response) => {
        setStudent(response.data);
        setMessage("");
      })
      .catch((error) => {
        console.error("Profile loading error:", error);
        setMessage("Unable to load profile. Please try again.");
      });
  }, [rollNo]);

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"
              alt="Student profile"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>

          <h1>SmartCampus</h1>
          <h2>My Profile</h2>
          <p>Your student information</p>
        </div>

        {/* COLLEGE PHOTO GALLERY */}
        <div className="profile-gallery">
          <div className="gallery-item">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=350&fit=crop"
              alt="College campus"
            />
            <p>College Campus</p>
          </div>

          <div className="gallery-item">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=350&fit=crop"
              alt="Students studying together"
            />
            <p>Student Life</p>
          </div>

          <div className="gallery-item">
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&h=350&fit=crop"
              alt="College students"
            />
            <p>Campus Community</p>
          </div>
        </div>

        {/* STUDENT DETAILS */}
        <div className="profile-content">
          <h3 className="details-heading">Student Details</h3>

          {message && (
            <p className="profile-message">{message}</p>
          )}

          {student && (
            <div className="profile-details">
              <div className="profile-row">
                <span>Name</span>
                <strong>{student.name || "Not available"}</strong>
              </div>

              <div className="profile-row">
                <span>Roll Number</span>
                <strong>{student.rollNo || "Not available"}</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>{student.email || "Not available"}</strong>
              </div>

              <div className="profile-row">
                <span>Department</span>
                <strong>{student.department || "Not available"}</strong>
              </div>

              <div className="profile-row">
                <span>Year</span>
                <strong>{student.year || "Not available"}</strong>
              </div>

              <div className="profile-row">
                <span>Phone</span>
                <strong>{student.phone || "Not available"}</strong>
              </div>
            </div>
          )}

          {!student && !message && (
            <p className="profile-loading">Loading profile...</p>
          )}

          <button
            className="profile-back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;