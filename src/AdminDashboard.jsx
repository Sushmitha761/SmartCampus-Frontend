
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = "https://smartcampus-backend-96ly.onrender.com/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("adminEmail");

  const [complaints, setComplaints] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [showComplaints, setShowComplaints] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);

  const [complaintMessages, setComplaintMessages] = useState({});
  const [message, setMessage] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [departmentEmail, setDepartmentEmail] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState(null);

  const detailPageOpen =
    showComplaints || showStatistics || showDepartments;

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    navigate("/admin-login");
  };

  const handleBackToDashboard = () => {
    setShowComplaints(false);
    setShowStatistics(false);
    setShowDepartments(false);
    setMessage("");
    setEditDepartmentId(null);
  };

  const handleViewComplaints = async () => {
    try {
      const response = await axios.get(`${API}/complaints/all`);
      setComplaints(response.data);
      setShowComplaints(true);
      setShowStatistics(false);
      setShowDepartments(false);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data || "Unable to load complaints."
      );
    }
  };

  const handleViewStatistics = async () => {
    try {
      const response = await axios.get(`${API}/complaints/statistics`);
      setStatistics(response.data);
      setShowStatistics(true);
      setShowComplaints(false);
      setShowDepartments(false);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data || "Unable to load statistics."
      );
    }
  };

  const handleViewDepartments = async () => {
    try {
      const response = await axios.get(`${API}/departments/all`);
      setDepartments(response.data);
      setShowDepartments(true);
      setShowComplaints(false);
      setShowStatistics(false);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data || "Unable to load departments."
      );
    }
  };

  const handleComplaintChange = (id, field, value) => {
    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id === id
          ? { ...complaint, [field]: value }
          : complaint
      )
    );
  };

  const handleUpdateComplaint = async (complaint) => {
    setComplaintMessages((previous) => ({
      ...previous,
      [complaint.id]: null,
    }));

    try {
      await axios.put(
        `${API}/complaints/update/${complaint.id}`,
        {
          department: complaint.department,
          status: complaint.status,
          resolution: complaint.resolution || "",
        }
      );

      setComplaintMessages((previous) => ({
        ...previous,
        [complaint.id]: {
          text: "Complaint updated successfully!",
          success: true,
        },
      }));

      const response = await axios.get(`${API}/complaints/all`);
      setComplaints(response.data);
    } catch (error) {
      setComplaintMessages((previous) => ({
        ...previous,
        [complaint.id]: {
          text:
            typeof error.response?.data === "string"
              ? error.response.data
              : "Complaint update failed. Please try again.",
          success: false,
        },
      }));
    }
  };

  const resetDepartmentForm = () => {
    setDepartmentName("");
    setStaffName("");
    setDepartmentEmail("");
    setEditDepartmentId(null);
  };

  const handleAddDepartment = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API}/departments/add`, {
        departmentName,
        staffName,
        email: departmentEmail,
      });

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Department added successfully!"
      );

      resetDepartmentForm();
      await handleViewDepartments();
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to add department."
      );
    }
  };

  const handleEditDepartment = (department) => {
    setEditDepartmentId(department.id);
    setDepartmentName(department.departmentName || "");
    setStaffName(department.staffName || "");
    setDepartmentEmail(department.email || "");
    setMessage("");
  };

  const handleUpdateDepartment = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${API}/departments/update/${editDepartmentId}`,
        {
          departmentName,
          staffName,
          email: departmentEmail,
        }
      );

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Department updated successfully!"
      );

      resetDepartmentForm();
      await handleViewDepartments();
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to update department."
      );
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API}/departments/delete/${id}`
      );

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Department deleted successfully!"
      );

      await handleViewDepartments();
    } catch (error) {
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete department."
      );
    }
  };

  const chartData = statistics
    ? [
        {
          name: "Pending",
          count: Number(statistics.pendingComplaints || 0),
        },
        {
          name: "In Progress",
          count: Number(statistics.inProgressComplaints || 0),
        },
        {
          name: "Resolved",
          count: Number(statistics.resolvedComplaints || 0),
        },
        {
          name: "Rejected",
          count: Number(statistics.rejectedComplaints || 0),
        },
      ]
    : [];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>SmartCampus</h1>
          <p style={styles.subtitle}>Admin Dashboard</p>
          <p style={styles.welcome}>
            Welcome, {adminEmail || "Admin"}
          </p>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      {!detailPageOpen && (
        <>
          <section style={styles.hero}>
            <div>
              <p style={styles.eyebrow}>SMART CAMPUS MANAGEMENT</p>
              <h2 style={styles.heroTitle}>
                Manage your campus, better.
              </h2>
              <p style={styles.heroText}>
                Review student complaints, manage departments, and
                monitor complaint statistics from one place.
              </p>
            </div>
          </section>

          <nav style={styles.navigation}>
            <button
              style={styles.navButton}
              onClick={handleViewComplaints}
            >
              📋 View All Complaints
            </button>

            <button
              style={styles.navButton}
              onClick={handleViewDepartments}
            >
              🏢 Manage Departments
            </button>

            <button
              style={styles.navButton}
              onClick={handleViewStatistics}
            >
              📊 Complaint Statistics
            </button>

            <button
              style={styles.navButton}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </nav>

          <div style={styles.imageGrid}>
            <div style={styles.imageCard}>
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80"
                alt="University campus"
                style={styles.image}
              />
              <h3>Campus Management</h3>
              <p>Keep campus services organized.</p>
            </div>

            <div style={styles.imageCard}>
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80"
                alt="Students on campus"
                style={styles.image}
              />
              <h3>Student Support</h3>
              <p>Help students get their complaints addressed.</p>
            </div>
          </div>
        </>
      )}

      {message && (
        <div style={styles.globalMessage}>{message}</div>
      )}

      {showComplaints && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>All Complaints</h2>

          {complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            complaints.map((complaint) => (
              <article key={complaint.id} style={styles.card}>
                <h3 style={styles.cardTitle}>
                  Complaint #{complaint.id}
                </h3>

                <p>
                  <strong>Student ID:</strong>{" "}
                  {complaint.studentId}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {complaint.category}
                </p>

                <p>
                  <strong>Title:</strong>{" "}
                  {complaint.title}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {complaint.description}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {complaint.priority}
                </p>

                <label style={styles.label}>Department</label>
                <select
                  style={styles.input}
                  value={complaint.department || ""}
                  onChange={(event) =>
                    handleComplaintChange(
                      complaint.id,
                      "department",
                      event.target.value
                    )
                  }
                >
                  <option value="">Select Department</option>

                  {departments.length > 0
                    ? departments.map((department) => (
                        <option
                          key={department.id}
                          value={department.departmentName}
                        >
                          {department.departmentName}
                        </option>
                      ))
                    : [
                        "Electricity",
                        "Water Supply",
                        "Wi-Fi",
                        "Classroom",
                        "Lab",
                        "Hostel",
                        "Sanitation",
                      ].map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                </select>

                <label style={styles.label}>Status</label>
                <select
                  style={styles.input}
                  value={complaint.status || "Pending"}
                  onChange={(event) =>
                    handleComplaintChange(
                      complaint.id,
                      "status",
                      event.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <label style={styles.label}>Resolution</label>
                <textarea
                  style={styles.textarea}
                  value={complaint.resolution || ""}
                  placeholder="Enter resolution details..."
                  onChange={(event) =>
                    handleComplaintChange(
                      complaint.id,
                      "resolution",
                      event.target.value
                    )
                  }
                />

                <button
                  style={styles.actionButton}
                  onClick={() => handleUpdateComplaint(complaint)}
                >
                  Update Complaint
                </button>

                {complaintMessages[complaint.id] && (
                  <p
                    style={{
                      ...styles.complaintMessage,
                      color: complaintMessages[complaint.id].success
                        ? "#15803d"
                        : "#b91c1c",
                      background: complaintMessages[complaint.id].success
                        ? "#dcfce7"
                        : "#fee2e2",
                    }}
                  >
                    {complaintMessages[complaint.id].text}
                  </p>
                )}
              </article>
            ))
          )}
        </section>
      )}

      {showDepartments && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Manage Departments</h2>

          <form
            style={styles.card}
            onSubmit={
              editDepartmentId
                ? handleUpdateDepartment
                : handleAddDepartment
            }
          >
            <h3>
              {editDepartmentId
                ? "Update Department"
                : "Add New Department"}
            </h3>

            <label style={styles.label}>Department Name</label>
            <input
              style={styles.input}
              value={departmentName}
              onChange={(event) =>
                setDepartmentName(event.target.value)
              }
              placeholder="Enter department name"
              required
            />

            <label style={styles.label}>Staff Name</label>
            <input
              style={styles.input}
              value={staffName}
              onChange={(event) => setStaffName(event.target.value)}
              placeholder="Enter staff name"
              required
            />

            <label style={styles.label}>Department Email</label>
            <input
              style={styles.input}
              type="email"
              value={departmentEmail}
              onChange={(event) =>
                setDepartmentEmail(event.target.value)
              }
              placeholder="Enter department email"
              required
            />

            <button style={styles.actionButton} type="submit">
              {editDepartmentId
                ? "Update Department"
                : "Add Department"}
            </button>

            {editDepartmentId && (
              <button
                style={styles.secondaryButton}
                type="button"
                onClick={resetDepartmentForm}
              >
                Cancel Edit
              </button>
            )}
          </form>

          {departments.map((department) => (
            <article key={department.id} style={styles.card}>
              <h3>{department.departmentName}</h3>
              <p>
                <strong>Staff:</strong> {department.staffName}
              </p>
              <p>
                <strong>Email:</strong> {department.email}
              </p>

              <div style={styles.buttonRow}>
                <button
                  style={styles.actionButton}
                  onClick={() => handleEditDepartment(department)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteButton}
                  onClick={() =>
                    handleDeleteDepartment(department.id)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          {departments.length === 0 && (
            <p>No departments found.</p>
          )}
        </section>
      )}

      {showStatistics && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Complaint Statistics</h2>

          {statistics && (
            <>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <p>Total Complaints</p>
                  <h2>{statistics.totalComplaints ?? 0}</h2>
                </div>

                <div style={styles.statCard}>
                  <p>Pending</p>
                  <h2>{statistics.pendingComplaints ?? 0}</h2>
                </div>

                <div style={styles.statCard}>
                  <p>In Progress</p>
                  <h2>{statistics.inProgressComplaints ?? 0}</h2>
                </div>

                <div style={styles.statCard}>
                  <p>Resolved</p>
                  <h2>{statistics.resolvedComplaints ?? 0}</h2>
                </div>

                <div style={styles.statCard}>
                  <p>Rejected</p>
                  <h2>{statistics.rejectedComplaints ?? 0}</h2>
                </div>
              </div>

              <div style={styles.chartCard}>
                <h3>Complaint Status Overview</h3>

                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* Back button at the BOTTOM of each details page */}
      {detailPageOpen && (
        <div style={styles.bottomBackContainer}>
          <button
            style={styles.backButton}
            onClick={handleBackToDashboard}
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    boxSizing: "border-box",
    background: "#f1f5f9",
    fontFamily: "Arial, sans-serif",
    color: "#1e293b",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    padding: "25px",
    marginBottom: "25px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #1d4ed8, #4338ca)",
    color: "white",
    boxShadow: "0 8px 24px rgba(30, 64, 175, 0.18)",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "bold",
  },

  subtitle: {
    margin: "6px 0",
    fontSize: "20px",
  },

  welcome: {
    margin: "8px 0 0",
    color: "#dbeafe",
  },

  hero: {
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    padding: "30px",
    marginBottom: "25px",
    borderRadius: "18px",
    color: "white",
    background:
      "linear-gradient(90deg, rgba(15,23,42,0.94), rgba(30,64,175,0.70)), url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80') center/cover",
    boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
  },

  eyebrow: {
    fontSize: "12px",
    letterSpacing: "2px",
    fontWeight: "bold",
    color: "#bfdbfe",
  },

  heroTitle: {
    fontSize: "32px",
    margin: "12px 0",
  },

  heroText: {
    maxWidth: "600px",
    lineHeight: 1.7,
  },

  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    maxWidth: "550px",
    margin: "0 auto 30px",
  },

  navButton: {
    width: "100%",
    padding: "17px 22px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 5px 12px rgba(37,99,235,0.18)",
  },

  logoutButton: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  imageCard: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    paddingBottom: "18px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.08)",
  },

  image: {
    width: "100%",
    height: "210px",
    objectFit: "cover",
  },

  section: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  sectionTitle: {
    margin: "25px 0",
    fontSize: "28px",
    color: "#1e3a8a",
  },

  card: {
    background: "white",
    padding: "24px",
    marginBottom: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.07)",
    border: "1px solid #e2e8f0",
  },

  cardTitle: {
    marginTop: 0,
    color: "#1d4ed8",
  },

  label: {
    display: "block",
    marginTop: "15px",
    marginBottom: "7px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "white",
    fontSize: "15px",
    marginBottom: "12px",
  },

  textarea: {
    display: "block",
    width: "100%",
    minHeight: "95px",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "15px",
    resize: "vertical",
    marginBottom: "15px",
  },

  actionButton: {
    padding: "12px 18px",
    marginTop: "10px",
    marginRight: "10px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "12px 18px",
    marginTop: "10px",
    border: "none",
    borderRadius: "9px",
    background: "#64748b",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  deleteButton: {
    padding: "12px 18px",
    marginTop: "10px",
    border: "none",
    borderRadius: "9px",
    background: "#dc2626",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  complaintMessage: {
    padding: "12px",
    borderRadius: "8px",
    marginTop: "15px",
    fontWeight: "bold",
  },

  globalMessage: {
    maxWidth: "1000px",
    margin: "15px auto",
    padding: "14px",
    borderRadius: "9px",
    background: "#dbeafe",
    color: "#1e40af",
    fontWeight: "bold",
  },

  statsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  statCard: {
    padding: "20px",
    borderRadius: "13px",
    background: "white",
    borderLeft: "5px solid #2563eb",
    boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
  },

  chartCard: {
    marginTop: "25px",
    padding: "20px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.07)",
  },

  bottomBackContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "35px",
    padding: "20px 0 10px",
  },

  backButton: {
    padding: "14px 26px",
    border: "none",
    borderRadius: "10px",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 5px 14px rgba(15,23,42,0.18)",
  },
};

export default AdminDashboard;
