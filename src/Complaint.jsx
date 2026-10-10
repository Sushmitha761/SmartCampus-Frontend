import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Complaint() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const rollNo = localStorage.getItem("rollNo");

    if (!rollNo) {
      setMessage("Please login first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const studentResponse = await axios.get(
        `http://localhost:8080/api/students/id/${encodeURIComponent(rollNo)}`
      );

      const studentId = studentResponse.data;

      await axios.post(
        "http://localhost:8080/api/complaints/submit",
        {
          studentId: studentId,
          category: category,
          title: title.trim(),
          description: description.trim(),
          priority: priority,
        }
      );

      setMessage("Complaint registered successfully!");
      setCategory("");
      setTitle("");
      setDescription("");
      setPriority("Medium");
    } catch (error) {
      console.error("Complaint submission error:", error);

      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Complaint submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "16px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#222222",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginTop: "5px",
    color: "#24324a",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "25px 15px",
        backgroundColor: "#f1f5f9",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header image section */}
        <div
          style={{
            minHeight: "190px",
            padding: "30px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#ffffff",
            backgroundImage:
              "linear-gradient(rgba(10,30,75,0.7), rgba(10,30,75,0.7)), url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 style={{ margin: "0 0 10px", fontSize: "32px" }}>
            SmartCampus
          </h1>

          <p style={{ margin: "5px 0", fontSize: "16px" }}>
            College Complaint Management System
          </p>

          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            Report campus issues easily
          </p>
        </div>

        {/* Complaint form section */}
        <div
          style={{
            display: "block",
            visibility: "visible",
            width: "100%",
            padding: "25px",
            backgroundColor: "#ffffff",
            color: "#222222",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#1e3a8a",
              marginTop: "0",
            }}
          >
            Submit Complaint
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              marginBottom: "25px",
            }}
          >
            Tell us about the issue you are facing on campus.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "block",
              visibility: "visible",
              opacity: 1,
              width: "100%",
            }}
          >
            <label htmlFor="category" style={labelStyle}>
              Complaint Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              style={inputStyle}
              required
            >
              <option value="">Select Complaint Category</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Classroom">Classroom</option>
              <option value="Lab">Lab</option>
              <option value="Hostel">Hostel</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="title" style={labelStyle}>
              Complaint Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter complaint title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              style={inputStyle}
              required
            />

            <label htmlFor="description" style={labelStyle}>
              Description
            </label>

            <textarea
              id="description"
              placeholder="Describe your complaint in detail..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              required
            />

            <label htmlFor="priority" style={labelStyle}>
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              style={inputStyle}
              required
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "7px",
                backgroundColor: loading ? "#94a3b8" : "#315bd6",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>

          {message && (
            <p
              role="status"
              style={{
                padding: "12px",
                marginTop: "15px",
                borderRadius: "6px",
                backgroundColor: "#eff6ff",
                color: "#1e40af",
                overflowWrap: "anywhere",
              }}
            >
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "12px",
              border: "1px solid #315bd6",
              borderRadius: "7px",
              backgroundColor: "#ffffff",
              color: "#315bd6",
              cursor: "pointer",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Complaint;