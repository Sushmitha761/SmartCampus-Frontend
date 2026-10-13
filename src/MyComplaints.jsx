
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyComplaints.css";

const API = "https://smartcampus-backend-96ly.onrender.com/api";

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingComplaintId, setEditingComplaintId] = useState(null);
  const [updatedComplaintId, setUpdatedComplaintId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editForm, setEditForm] = useState({
    category: "",
    title: "",
    description: "",
    priority: "Medium",
  });

  const [feedback, setFeedback] = useState({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({});

  const rollNo = localStorage.getItem("rollNo");

  const getStudentId = async () => {
    if (!rollNo) {
      throw new Error("Please login again to continue.");
    }

    const response = await axios.get(
      `${API}/students/id/${encodeURIComponent(rollNo)}`
    );

    if (response.data === null || response.data === undefined) {
      throw new Error("Student ID not found. Please login again.");
    }

    return response.data;
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const studentId = await getStudentId();

      const response = await axios.get(
        `${API}/complaints/student/${studentId}`
      );

      setComplaints(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching complaints:", error);

      setErrorMessage(
        error.response?.data?.message ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : null) ||
          error.message ||
          "Unable to load complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Edit only Pending complaints
  const handleEditClick = (complaint) => {
    clearMessages();
    setUpdatedComplaintId(null);

    if (complaint.status?.toLowerCase() !== "pending") {
      setErrorMessage("Only pending complaints can be edited.");
      return;
    }

    setEditingComplaintId(complaint.id);

    setEditForm({
      category: complaint.category || "",
      title: complaint.title || "",
      description: complaint.description || "",
      priority: complaint.priority || "Medium",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Save complaint and show success message on the same card
  const handleUpdateComplaint = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!editForm.title.trim() || !editForm.description.trim()) {
      setErrorMessage(
        "Please enter both title and description."
      );
      return;
    }

    try {
      setSaving(true);

      const studentId = await getStudentId();
      const complaintId = editingComplaintId;

      await axios.put(
        `${API}/complaints/student/update/${complaintId}/${studentId}`,
        {
          category: editForm.category,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          priority: editForm.priority,
        }
      );

      setEditingComplaintId(null);
      setUpdatedComplaintId(complaintId);
      setSuccessMessage("");

      // Refresh the list without clearing the success message
      const response = await axios.get(
        `${API}/complaints/student/${studentId}`
      );

      setComplaints(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error updating complaint:", error);

      setErrorMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
              "Unable to update complaint. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingComplaintId(null);

    setEditForm({
      category: "",
      title: "",
      description: "",
      priority: "Medium",
    });

    clearMessages();
  };

  // Delete only Pending complaints
  const handleDeleteComplaint = async (complaint) => {
    clearMessages();
    setUpdatedComplaintId(null);

    if (complaint.status?.toLowerCase() !== "pending") {
      setErrorMessage("Only pending complaints can be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${complaint.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(complaint.id);

      const studentId = await getStudentId();

      await axios.delete(
        `${API}/complaints/student/delete/${complaint.id}/${studentId}`
      );

      if (editingComplaintId === complaint.id) {
        setEditingComplaintId(null);
      }

      setSuccessMessage("Complaint deleted successfully.");

      const response = await axios.get(
        `${API}/complaints/student/${studentId}`
      );

      setComplaints(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error deleting complaint:", error);

      setErrorMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
              "Unable to delete complaint. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleFeedbackChange = (complaintId, field, value) => {
    setFeedback((previousFeedback) => ({
      ...previousFeedback,
      [complaintId]: {
        ...previousFeedback[complaintId],
        [field]: value,
      },
    }));
  };

  const handleFeedbackSubmit = async (event, complaintId) => {
    event.preventDefault();
    clearMessages();

    const currentFeedback = feedback[complaintId] || {
      rating: "5",
      comments: "",
    };

    try {
      const studentId = await getStudentId();

      await axios.post(`${API}/feedback/submit`, {
        complaintId,
        studentId,
        rating: Number(currentFeedback.rating),
        comments: currentFeedback.comments || "",
      });

      setFeedbackSubmitted((previousState) => ({
        ...previousState,
        [complaintId]: true,
      }));

      setSuccessMessage(
        "Thank you! Your feedback was submitted."
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);

      setErrorMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
              "Unable to submit feedback. Please try again."
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "in progress":
        return "status-in-progress";
      case "resolved":
        return "status-resolved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-default";
    }
  };

  const getCategoryImage = (category) => {
    const commonProps = {
      width: "70",
      height: "70",
      viewBox: "0 0 100 100",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    };

    switch (category?.toLowerCase()) {
      case "wi-fi":
      case "wifi":
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#E0F2FE" />
            <path
              d="M20 40 Q50 10 80 40"
              stroke="#0284C7"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M30 52 Q50 32 70 52"
              stroke="#0284C7"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M40 64 Q50 54 60 64"
              stroke="#0284C7"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx="50" cy="76" r="5" fill="#0284C7" />
          </svg>
        );

      case "electricity":
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#FEF3C7" />
            <path
              d="M56 12 L30 54 H47 L41 86 L72 43 H53 Z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        );

      case "water":
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#DBEAFE" />
            <path
              d="M50 17 C50 17 27 46 27 60 A23 23 0 0 0 73 60 C73 46 50 17 50 17Z"
              fill="#3B82F6"
            />
            <path
              d="M39 62 Q40 70 48 72"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        );

      case "classroom":
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#DCFCE7" />
            <rect
              x="20"
              y="23"
              width="60"
              height="40"
              rx="4"
              fill="#16A34A"
            />
            <rect
              x="26"
              y="29"
              width="48"
              height="28"
              fill="#BBF7D0"
            />
            <path
              d="M50 63 V78 M35 78 H65"
              stroke="#166534"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        );

      case "lab":
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#F3E8FF" />
            <path
              d="M40 20 H60 M45 20 V43 L29 70 Q26 78 37 80 H63 Q74 78 71 70 L55 43 V20"
              stroke="#9333EA"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M36 65 H64 L71 75 H29 Z"
              fill="#C084FC"
            />
            <circle cx="44" cy="62" r="3" fill="#7E22CE" />
            <circle cx="56" cy="70" r="3" fill="#7E22CE" />
          </svg>
        );

      case "hostel":
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#FFE4E6" />
            <path
              d="M20 45 L50 20 L80 45 V78 H20 Z"
              fill="#F43F5E"
            />
            <rect
              x="40"
              y="54"
              width="20"
              height="24"
              fill="#FFF1F2"
            />
            <rect
              x="28"
              y="49"
              width="10"
              height="10"
              fill="#FFF1F2"
            />
            <rect
              x="62"
              y="49"
              width="10"
              height="10"
              fill="#FFF1F2"
            />
          </svg>
        );

      case "sanitation":
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#CCFBF1" />
            <path
              d="M35 25 H65 V35 H35 Z M40 35 V65 Q40 73 50 73 Q60 73 60 65 V35"
              stroke="#0F766E"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M32 78 H68"
              stroke="#0F766E"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        );

      default:
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill="#EDE9FE" />
            <path
              d="M25 35 L50 18 L75 35 V75 H25 Z"
              fill="#8B5CF6"
            />
            <rect
              x="43"
              y="52"
              width="14"
              height="23"
              fill="#DDD6FE"
            />
          </svg>
        );
    }
  };

  return (
    <div className="my-complaints-page">
      <div className="my-complaints-container">
        <div className="my-complaints-header">
          <div>
            <h1>My Complaints</h1>
            <p>Track and manage your submitted complaints.</p>
          </div>

          <button
            type="button"
            className="back-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {errorMessage && (
          <div
            className="complaint-alert complaint-alert-error"
            role="alert"
          >
            {errorMessage}
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div
            className="complaint-alert complaint-alert-success"
            role="status"
          >
            {successMessage}
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              aria-label="Close success message"
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="complaints-message">
            <div className="complaints-loader" />
            <p>Loading your complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="complaints-empty">
            <div className="empty-icon">📋</div>
            <h2>No complaints found</h2>
            <p>You have not submitted any complaints yet.</p>

            <button
              type="button"
              className="create-complaint-btn"
              onClick={() => navigate("/complaint")}
            >
              + Create Complaint
            </button>
          </div>
        ) : (
          <>
            <div className="complaints-summary">
              <div className="summary-card">
                <span className="summary-label">
                  Total Complaints
                </span>
                <strong>{complaints.length}</strong>
              </div>

              <div className="summary-card">
                <span className="summary-label">Pending</span>
                <strong>
                  {
                    complaints.filter(
                      (item) =>
                        item.status?.toLowerCase() === "pending"
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-card">
                <span className="summary-label">In Progress</span>
                <strong>
                  {
                    complaints.filter(
                      (item) =>
                        item.status?.toLowerCase() === "in progress"
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-card">
                <span className="summary-label">Resolved</span>
                <strong>
                  {
                    complaints.filter(
                      (item) =>
                        item.status?.toLowerCase() === "resolved"
                    ).length
                  }
                </strong>
              </div>
            </div>

            <div className="complaints-list">
              {complaints.map((complaint) => {
                const isPending =
                  complaint.status?.toLowerCase() === "pending";

                const isResolved =
                  complaint.status?.toLowerCase() === "resolved";

                const isEditing =
                  editingComplaintId === complaint.id;

                return (
                  <article
                    className="my-complaint-card"
                    key={complaint.id}
                  >
                    <div className="complaint-card-top">
                      <div className="complaint-category-image">
                        {getCategoryImage(complaint.category)}
                      </div>

                      <div className="complaint-card-heading">
                        <span className="complaint-id">
                          Complaint #{complaint.id}
                        </span>

                        <h2>{complaint.title}</h2>

                        <div className="complaint-meta">
                          <span className="complaint-category">
                            {complaint.category}
                          </span>

                          <span
                            className={`complaint-status ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status || "Unknown"}
                          </span>

                          <span
                            className={`complaint-priority priority-${(
                              complaint.priority || "medium"
                            ).toLowerCase()}`}
                          >
                            {complaint.priority || "Medium"} Priority
                          </span>
                        </div>
                      </div>
                    </div>

                    {isEditing ? (
                      <form
                        className="complaint-edit-form"
                        onSubmit={handleUpdateComplaint}
                      >
                        <h3>Edit Complaint</h3>

                        <label htmlFor={`category-${complaint.id}`}>
                          Category
                        </label>

                        <select
                          id={`category-${complaint.id}`}
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Electricity">Electricity</option>
                          <option value="Water">Water</option>
                          <option value="Wi-Fi">Wi-Fi</option>
                          <option value="Classroom">Classroom</option>
                          <option value="Lab">Lab</option>
                          <option value="Hostel">Hostel</option>
                          <option value="Sanitation">Sanitation</option>
                          <option value="Other">Other</option>
                        </select>

                        <label htmlFor={`title-${complaint.id}`}>
                          Complaint Title
                        </label>

                        <input
                          id={`title-${complaint.id}`}
                          name="title"
                          type="text"
                          value={editForm.title}
                          onChange={handleEditChange}
                          maxLength={150}
                          required
                        />

                        <label
                          htmlFor={`description-${complaint.id}`}
                        >
                          Description
                        </label>

                        <textarea
                          id={`description-${complaint.id}`}
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows={4}
                          required
                        />

                        <label htmlFor={`priority-${complaint.id}`}>
                          Priority
                        </label>

                        <select
                          id={`priority-${complaint.id}`}
                          name="priority"
                          value={editForm.priority}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>

                        <div className="complaint-edit-actions">
                          <button
                            type="submit"
                            className="save-complaint-btn"
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            className="cancel-edit-btn"
                            onClick={handleCancelEdit}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="complaint-description">
                          <h3>Description</h3>
                          <p>{complaint.description}</p>
                        </div>

                        <div className="complaint-resolution">
                          <h3>Department</h3>
                          <p>
                            {complaint.department || "Not assigned yet"}
                          </p>
                        </div>

                        {complaint.resolution && (
                          <div className="complaint-resolution">
                            <h3>Resolution / Admin Remarks</h3>
                            <p>{complaint.resolution}</p>
                          </div>
                        )}

                        {/* Update success appears on this complaint card */}
                        {updatedComplaintId === complaint.id && (
                          <div
                            className="complaint-alert complaint-alert-success"
                            role="status"
                          >
                            ✓ Complaint updated successfully.
                          </div>
                        )}

                        {isPending && (
                          <div className="complaint-actions">
                            <button
                              type="button"
                              className="edit-complaint-btn"
                              onClick={() =>
                                handleEditClick(complaint)
                              }
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              className="delete-complaint-btn"
                              onClick={() =>
                                handleDeleteComplaint(complaint)
                              }
                              disabled={deletingId === complaint.id}
                            >
                              {deletingId === complaint.id
                                ? "Deleting..."
                                : "🗑️ Delete"}
                            </button>
                          </div>
                        )}

                        {isResolved &&
                          !feedbackSubmitted[complaint.id] && (
                            <form
                              className="complaint-feedback-form"
                              onSubmit={(event) =>
                                handleFeedbackSubmit(
                                  event,
                                  complaint.id
                                )
                              }
                            >
                              <h3>Share Your Feedback</h3>

                              <label
                                htmlFor={`rating-${complaint.id}`}
                              >
                                Rating
                              </label>

                              <select
                                id={`rating-${complaint.id}`}
                                value={
                                  feedback[complaint.id]?.rating || "5"
                                }
                                onChange={(event) =>
                                  handleFeedbackChange(
                                    complaint.id,
                                    "rating",
                                    event.target.value
                                  )
                                }
                                required
                              >
                                <option value="5">
                                  ⭐⭐⭐⭐⭐ Excellent
                                </option>
                                <option value="4">
                                  ⭐⭐⭐⭐ Good
                                </option>
                                <option value="3">
                                  ⭐⭐⭐ Average
                                </option>
                                <option value="2">⭐⭐ Poor</option>
                                <option value="1">⭐ Very Poor</option>
                              </select>

                              <label
                                htmlFor={`comments-${complaint.id}`}
                              >
                                Comments (optional)
                              </label>

                              <textarea
                                id={`comments-${complaint.id}`}
                                rows={3}
                                placeholder="Tell us about your experience..."
                                value={
                                  feedback[complaint.id]?.comments || ""
                                }
                                onChange={(event) =>
                                  handleFeedbackChange(
                                    complaint.id,
                                    "comments",
                                    event.target.value
                                  )
                                }
                              />

                              <button
                                type="submit"
                                className="submit-feedback-btn"
                              >
                                Submit Feedback
                              </button>
                            </form>
                          )}

                        {feedbackSubmitted[complaint.id] && (
                          <div className="feedback-success">
                            ✓ Feedback submitted successfully. Thank you!
                          </div>
                        )}
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
