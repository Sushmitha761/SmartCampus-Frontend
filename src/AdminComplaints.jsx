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
  ResponsiveContainer
} from "recharts";

const API = "http://localhost:8080/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("adminEmail");

  const [complaints, setComplaints] = useState([]);
  const [showComplaints, setShowComplaints] = useState(false);

  const [message, setMessage] = useState("");
  const [complaintMessages, setComplaintMessages] = useState({});

  const [statistics, setStatistics] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [showDepartments, setShowDepartments] = useState(false);

  const [departmentName, setDepartmentName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [departmentEmail, setDepartmentEmail] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    navigate("/admin-login");
  };

  const handleViewComplaints = async () => {
    try {
      const response = await axios.get(`${API}/complaints/all`);

      setComplaints(response.data);
      setShowComplaints(true);
      setShowStatistics(false);
      setShowDepartments(false);
      setMessage("");
      setComplaintMessages({});
    } catch (error) {
      console.error(error);
      setMessage("Unable to load complaints!");
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
      console.error(error);
      setMessage("Unable to load statistics!");
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
      console.error(error);
      setMessage("Unable to load departments!");
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/departments/add`, {
        departmentName,
        staffName,
        email: departmentEmail
      });

      setMessage("Department added successfully!");
      setDepartmentName("");
      setStaffName("");
      setDepartmentEmail("");

      const response = await axios.get(`${API}/departments/all`);
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Department addition failed!"
      );
    }
  };

  const handleEditDepartment = (department) => {
    setEditDepartmentId(department.id);
    setDepartmentName(department.departmentName);
    setStaffName(department.staffName);
    setDepartmentEmail(department.email);
    setMessage("");
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API}/departments/update/${editDepartmentId}`,
        {
          departmentName,
          staffName,
          email: departmentEmail
        }
      );

      setMessage("Department updated successfully!");
      setEditDepartmentId(null);
      setDepartmentName("");
      setStaffName("");
      setDepartmentEmail("");

      const response = await axios.get(`${API}/departments/all`);
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Department update failed!"
      );
    }
  };

  const handleCancelEdit = () => {
    setEditDepartmentId(null);
    setDepartmentName("");
    setStaffName("");
    setDepartmentEmail("");
    setMessage("");
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      await axios.delete(`${API}/departments/delete/${id}`);

      setMessage("Department deleted successfully!");

      const response = await axios.get(`${API}/departments/all`);
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Department deletion failed!"
      );
    }
  };

  // Update complaint and show feedback on that same card
  const handleUpdateComplaint = async (complaint) => {
    setComplaintMessages((previous) => ({
      ...previous,
      [complaint.id]: { text: "", success: false }
    }));

    try {
      await axios.put(`${API}/complaints/update/${complaint.id}`, {
        department: complaint.department,
        status: complaint.status,
        resolution: complaint.resolution
      });

      // Show the message immediately on this complaint card
      setComplaintMessages((previous) => ({
        ...previous,
        [complaint.id]: {
          text: "Complaint updated successfully!",
          success: true
        }
      }));

      // Refresh complaint data
      const response = await axios.get(`${API}/complaints/all`);
      setComplaints(response.data);
    } catch (error) {
      console.error("Complaint update failed:", error);

      setComplaintMessages((previous) => ({
        ...previous,
        [complaint.id]: {
          text:
            typeof error.response?.data === "string"
              ? error.response.data
              : "Complaint update failed!",
          success: false
        }
      }));
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

    setComplaintMessages((previous) => ({
      ...previous,
      [id]: { text: "", success: false }
    }));
  };

  const chartData = statistics
    ? [
        {
          name: "Pending",
          complaints: statistics.pendingComplaints ?? 0
        },
        {
          name: "In Progress",
          complaints: statistics.inProgressComplaints ?? 0
        },
        {
          name: "Resolved",
          complaints: statistics.resolvedComplaints ?? 0
        },
        {
          name: "Rejected",
          complaints: statistics.rejectedComplaints ?? 0
        }
      ]
    : [];

  return (
    <div style={pageStyle}>
      <h1 style={{ textAlign: "center", color: "#1e3a8a" }}>
        SmartCampus
      </h1>

      <h2 style={{ textAlign: "center", color: "#374151" }}>
        Admin Dashboard
      </h2>

      <p style={{ textAlign: "center", fontSize: "18px" }}>
        Welcome, <strong>{adminEmail || "Admin"}</strong>
      </p>

      <div style={buttonContainerStyle}>
        <button onClick={handleViewComplaints} style={buttonStyle("#2563eb")}>
          📋 View All Complaints
        </button>

        <button onClick={handleViewDepartments} style={buttonStyle("#7c3aed")}>
          🏢 Manage Departments
        </button>

        <button onClick={handleViewStatistics} style={buttonStyle("#059669")}>
          📊 Complaint Statistics
        </button>

        <button onClick={handleLogout} style={buttonStyle("#dc2626")}>
          🚪 Logout
        </button>
      </div>

      {message && (
        <p style={generalMessageStyle}>{message}</p>
      )}

      {/* All complaints */}
      {showComplaints && (
        <section style={sectionStyle}>
          <h2 style={headingStyle}>📋 All Complaints</h2>

          {complaints.length === 0 ? (
            <p style={{ textAlign: "center" }}>No complaints found.</p>
          ) : (
            complaints.map((complaint) => {
              const cardMessage = complaintMessages[complaint.id];

              return (
                <div key={complaint.id} style={cardStyle}>
                  <h3>{complaint.title}</h3>

                  <p><strong>Complaint ID:</strong> {complaint.id}</p>
                  <p><strong>Student ID:</strong> {complaint.studentId}</p>
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Description:</strong> {complaint.description}</p>
                  <p><strong>Priority:</strong> {complaint.priority}</p>

                  <label style={labelStyle}>Department</label>
                  <select
                    value={complaint.department || ""}
                    onChange={(e) =>
                      handleComplaintChange(
                        complaint.id,
                        "department",
                        e.target.value
                      )
                    }
                    style={inputStyle}
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
                          "Sanitation"
                        ].map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                  </select>

                  <label style={labelStyle}>Status</label>
                  <select
                    value={complaint.status || "Pending"}
                    onChange={(e) =>
                      handleComplaintChange(
                        complaint.id,
                        "status",
                        e.target.value
                      )
                    }
                    style={inputStyle}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <label style={labelStyle}>Resolution</label>
                  <textarea
                    value={complaint.resolution || ""}
                    onChange={(e) =>
                      handleComplaintChange(
                        complaint.id,
                        "resolution",
                        e.target.value
                      )
                    }
                    placeholder="Enter resolution details"
                    rows={3}
                    style={inputStyle}
                  />

                  <button
                    onClick={() => handleUpdateComplaint(complaint)}
                    style={buttonStyle("#2563eb")}
                  >
                    Update Complaint
                  </button>

                  {/* Message appears under this card's button */}
                  {cardMessage?.text && (
                    <p
                      role="status"
                      style={{
                        color: cardMessage.success ? "#15803d" : "#dc2626",
                        background: cardMessage.success ? "#f0fdf4" : "#fef2f2",
                        padding: "12px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        marginTop: "12px"
                      }}
                    >
                      {cardMessage.text}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </section>
      )}

      {/* Department management */}
      {showDepartments && (
        <section style={sectionStyle}>
          <h2 style={headingStyle}>🏢 Manage Departments</h2>

          <div style={cardStyle}>
            <h3>{editDepartmentId ? "Edit Department" : "Add Department"}</h3>

            <form
              onSubmit={
                editDepartmentId
                  ? handleUpdateDepartment
                  : handleAddDepartment
              }
            >
              <input
                type="text"
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Staff Name"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                required
                style={inputStyle}
              />

              <input
                type="email"
                placeholder="Department Email"
                value={departmentEmail}
                onChange={(e) => setDepartmentEmail(e.target.value)}
                required
                style={inputStyle}
              />

              <button type="submit" style={buttonStyle("#7c3aed")}>
                {editDepartmentId ? "Update Department" : "Add Department"}
              </button>

              {editDepartmentId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={buttonStyle("#6b7280")}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {departments.map((department) => (
            <div key={department.id} style={cardStyle}>
              <h3>{department.departmentName}</h3>
              <p><strong>Staff:</strong> {department.staffName}</p>
              <p><strong>Email:</strong> {department.email}</p>

              <button
                onClick={() => handleEditDepartment(department)}
                style={buttonStyle("#2563eb")}
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteDepartment(department.id)}
                style={buttonStyle("#dc2626")}
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Statistics */}
      {showStatistics && statistics && (
        <section style={sectionStyle}>
          <h2 style={headingStyle}>📊 Complaint Statistics</h2>

          <div style={statsGridStyle}>
            {[
              ["Total", statistics.totalComplaints],
              ["Pending", statistics.pendingComplaints],
              ["In Progress", statistics.inProgressComplaints],
              ["Resolved", statistics.resolvedComplaints],
              ["Rejected", statistics.rejectedComplaints]
            ].map(([name, value]) => (
              <div key={name} style={cardStyle}>
                <h3>{name}</h3>
                <h2>{value ?? 0}</h2>
              </div>
            ))}
          </div>

          <div style={{ width: "100%", height: "350px", marginTop: "25px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="complaints" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f2f6fc",
  padding: "30px",
  boxSizing: "border-box"
};

const buttonContainerStyle = {
  maxWidth: "450px",
  margin: "30px auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const buttonStyle = (background) => ({
  padding: "12px 16px",
  fontSize: "15px",
  cursor: "pointer",
  background,
  color: "white",
  border: "none",
  borderRadius: "8px",
  marginTop: "8px",
  marginRight: "8px"
});

const generalMessageStyle = {
  textAlign: "center",
  color: "#166534",
  fontWeight: "bold",
  background: "white",
  padding: "12px",
  borderRadius: "8px",
  maxWidth: "900px",
  margin: "20px auto"
};

const sectionStyle = {
  maxWidth: "900px",
  margin: "40px auto"
};

const headingStyle = {
  textAlign: "center",
  color: "#1e3a8a",
  marginBottom: "25px"
};

const cardStyle = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
  marginBottom: "20px"
};

const labelStyle = {
  display: "block",
  marginTop: "15px",
  fontWeight: "bold"
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "12px",
  boxSizing: "border-box",
  border: "1px solid #d1d5db",
  borderRadius: "6px"
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "15px"
};

export default AdminDashboard;