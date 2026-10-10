import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const rollNo = localStorage.getItem("rollNo");

  const handleLogout = () => {
    localStorage.removeItem("rollNo");
    navigate("/");
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">

        <div className="dashboard-logo">

          <span className="logo-icon">
            🎓
          </span>

          <div>
            <h1>SmartCampus</h1>
            <p>College Complaint Management System</p>
          </div>

        </div>

        <button
          className="logout-top-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      {/* MAIN */}
      <main className="dashboard-main">

        {/* WELCOME */}
        <section className="welcome-section">

          <div>
            <p className="small-heading">
              STUDENT PORTAL
            </p>

            <h2>
              Student Dashboard
            </h2>

            <p className="welcome-text">
              Welcome back! Manage your campus complaints
              and track their status from here.
            </p>
          </div>


          {/* STUDENT BADGE */}
          <div className="student-badge">

            <span>
              👤
            </span>

            <div>
              <small>
                Logged in as
              </small>

              <strong>
                {rollNo || "Student"}
              </strong>
            </div>

          </div>

        </section>


        {/* CAMPUS BANNER */}
        <section className="dashboard-banner">

          <div className="banner-content">

            <h3>
              Make your campus better
            </h3>

            <p>
              Report problems and help improve
              your college facilities.
            </p>

          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section className="actions-section">

          <div className="section-title">

            <h3>
              Quick Actions
            </h3>

            <p>
              Choose an option to continue
            </p>

          </div>


          {/* FOUR SAME-SIZE CARDS */}
          <div className="dashboard-cards">


            {/* 1. SUBMIT COMPLAINT */}
            <button
              className="dashboard-card card-one"
              onClick={() => navigate("/complaint")}
            >

              <div className="card-icon">
                📝
              </div>

              <div className="card-content">

                <h4>
                  1. Submit Complaint
                </h4>

                <p>
                  Report a new campus issue
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </button>


            {/* 2. MY COMPLAINTS */}
            <button
              className="dashboard-card complaints-card"
              onClick={() => navigate("/my-complaints")}
            >

              <div className="card-icon">
                📋
              </div>

              <div className="card-content">

                <h4>
                  2. My Complaints
                </h4>

                <p>
                  Track your complaint status
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </button>


            {/* 3. MY PROFILE */}
            <button
              className="dashboard-card card-three"
              onClick={() => navigate("/profile")}
            >

              <div className="card-icon">
                👤
              </div>

              <div className="card-content">

                <h4>
                  3. My Profile
                </h4>

                <p>
                  View your student details
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </button>


            {/* 4. LOGOUT */}
            <button
              className="dashboard-card logout-card"
              onClick={handleLogout}
            >

              <div className="card-icon">
                🚪
              </div>

              <div className="card-content">

                <h4>
                  4. Logout
                </h4>

                <p>
                  Sign out from your account
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </button>


          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;